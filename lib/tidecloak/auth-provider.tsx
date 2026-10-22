'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { DemoIdentityId, IdentitySession } from '../rental-passport/contracts'
import { SIMULATED_PAYLOAD_PREFIX } from '../rental-passport/contracts'

export interface TideCloakContextValue {
  isInitializing: boolean
  authenticated: boolean
  user: IdentitySession | null
  login: (identityId?: DemoIdentityId) => Promise<void>
  logout: () => Promise<void>
  renewSession: () => Promise<void>
  hasRealmRole: (role: string) => boolean
  hasClientRole: (role: string, resource?: string) => boolean
  getValueFromToken: (key: string) => any
  getValueFromIdToken: (key: string) => any
  doEncrypt: (items: Array<{ data: string | Uint8Array; tags: string[] }>) => Promise<string[]>
  doDecrypt: (items: Array<{ encrypted: string; tags: string[] }>) => Promise<string[]>
  secureFetch: (url: string, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<TideCloakContextValue | null>(null)

export function TideCloakAuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<IdentitySession | null>(null)

  const syncSession = useCallback(async () => {
    try {
      const res = await fetch('/api/session', { credentials: 'same-origin' })
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.session) {
          setUser(data.session)
          setAuthenticated(true)
          return
        }
      }
      setUser(null)
      setAuthenticated(false)
    } catch (e) {
      console.error('Failed to sync demo session:', e)
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    syncSession()
  }, [syncSession])

  const login = useCallback(
    async (identityId: DemoIdentityId = 'tenant') => {
      setIsInitializing(true)
      try {
        const res = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ identityId }),
        })
        if (!res.ok) {
          throw new Error('Failed to establish demo session')
        }
        const data = await res.json()
        setUser(data.session)
        setAuthenticated(true)
      } finally {
        setIsInitializing(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    setIsInitializing(true)
    try {
      await fetch('/api/session', { method: 'DELETE', credentials: 'same-origin' })
      setUser(null)
      setAuthenticated(false)
    } finally {
      setIsInitializing(false)
    }
  }, [])

  const renewSession = useCallback(async () => {
    if (!user) return
    await login(user.identityId)
  }, [user, login])

  const hasRealmRole = useCallback(
    (role: string): boolean => {
      if (!user) return false
      return user.realmRoles.includes(role)
    },
    [user],
  )

  const hasClientRole = useCallback(
    (role: string): boolean => {
      if (!user) return false
      return user.roles.includes(role)
    },
    [user],
  )

  const getValueFromToken = useCallback(
    (key: string): any => {
      if (!user) return null
      if (key === 'preferred_username') return user.identityId
      if (key === 'vuid') return user.vuid
      if (key === 'tideuserkey') return user.tideuserkey
      return (user as any)[key] ?? null
    },
    [user],
  )

  const getValueFromIdToken = getValueFromToken

  // Simulated browser package protection
  const doEncrypt = useCallback(
    async (items: Array<{ data: string | Uint8Array; tags: string[] }>): Promise<string[]> => {
      if (!authenticated || !user) {
        throw new Error('Access Error: User must be signed in to protect package payload.')
      }

      const payloads: string[] = []

      for (const item of items) {
        const tag = item.tags[0]
        const requiredRole = `_tide_${tag}.selfencrypt`
        if (!hasRealmRole(requiredRole)) {
          throw new Error(
            `Policy Denial: Active account '${user.identityId}' lacks encryption role '${requiredRole}' for tag '${tag}'.`,
          )
        }

        const dataStr =
          typeof item.data === 'string'
            ? item.data
            : new TextDecoder().decode(item.data)

        // Point 5: Encode payload using simulated prefix
        const base64Data = btoa(unescape(encodeURIComponent(dataStr)))
        const protectedPayload = `${SIMULATED_PAYLOAD_PREFIX}${tag}:${base64Data}`
        payloads.push(protectedPayload)
      }

      return payloads
    },
    [authenticated, user, hasRealmRole],
  )

  // Simulated browser package decryption
  const doDecrypt = useCallback(
    async (items: Array<{ encrypted: string; tags: string[] }>): Promise<string[]> => {
      if (!authenticated || !user) {
        throw new Error('Access Error: User must be signed in to decrypt package payload.')
      }

      const results: string[] = []

      for (const item of items) {
        const tag = item.tags[0]
        const requiredRole = `_tide_${tag}.selfdecrypt`

        // Check if the current user possesses the required decrypt role
        if (!hasRealmRole(requiredRole)) {
          throw new Error(
            `Policy Denial: Active account '${user.identityId}' lacks required decrypt role '${requiredRole}' for tag '${tag}'.`,
          )
        }

        // Point 5: Unpack simulated payload
        if (item.encrypted.startsWith(SIMULATED_PAYLOAD_PREFIX)) {
          const rest = item.encrypted.substring(SIMULATED_PAYLOAD_PREFIX.length)
          const colonIdx = rest.indexOf(':')
          if (colonIdx !== -1) {
            const base64Data = rest.substring(colonIdx + 1)
            const plaintext = decodeURIComponent(escape(atob(base64Data)))
            results.push(plaintext)
            continue
          }
        }

        throw new Error('Access Error: Invalid payload structure or tag integrity check failure.')
      }

      return results
    },
    [authenticated, user, hasRealmRole],
  )

  const secureFetch = useCallback(
    async (url: string, init: RequestInit = {}): Promise<Response> => {
      return fetch(url, { ...init, credentials: 'same-origin' })
    },
    [],
  )

  return (
    <AuthContext.Provider
      value={{
        isInitializing,
        authenticated,
        user,
        login,
        logout,
        renewSession,
        hasRealmRole,
        hasClientRole,
        getValueFromToken,
        getValueFromIdToken,
        doEncrypt,
        doDecrypt,
        secureFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useTideAuth(): TideCloakContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useTideAuth must be used within a TideCloakAuthProvider')
  }
  return context
}
