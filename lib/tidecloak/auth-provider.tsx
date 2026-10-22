'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { DemoIdentityId, IdentitySession } from '../rental-passport/contracts'

export interface TideCloakContextValue {
  isInitializing: boolean
  authenticated: boolean
  user: IdentitySession | null
  token: string | null
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
  const [token, setToken] = useState<string | null>(null)

  const syncSession = useCallback(async () => {
    try {
      const res = await fetch('/api/session')
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.session) {
          setUser(data.session)
          setAuthenticated(true)
          setToken(data.session.token)
          return
        }
      }
      setUser(null)
      setAuthenticated(false)
      setToken(null)
    } catch (e) {
      console.error('Failed to sync TideCloak session:', e)
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
          body: JSON.stringify({ identityId }),
        })
        if (!res.ok) {
          throw new Error('Failed to authenticate against realm rental-passport')
        }
        const data = await res.json()
        setUser(data.session)
        setAuthenticated(true)
        setToken(data.session.token)
      } finally {
        setIsInitializing(false)
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    setIsInitializing(true)
    try {
      await fetch('/api/session', { method: 'DELETE' })
      setUser(null)
      setAuthenticated(false)
      setToken(null)
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

  // TideCloak Browser E2EE Encrypt
  const doEncrypt = useCallback(
    async (items: Array<{ data: string | Uint8Array; tags: string[] }>): Promise<string[]> => {
      if (!authenticated || !user) {
        throw new Error('TideCloak E2EE Error: User must be signed in to perform encryption.')
      }

      const ciphertexts: string[] = []

      for (const item of items) {
        const tag = item.tags[0]
        const requiredRole = `_tide_${tag}.selfencrypt`
        if (!hasRealmRole(requiredRole)) {
          throw new Error(
            `TideCloak Policy Denial: Active session '${user.identityId}' lacks encryption role '${requiredRole}' for tag '${tag}'.`,
          )
        }

        const dataStr =
          typeof item.data === 'string'
            ? item.data
            : new TextDecoder().decode(item.data)

        // Generate synthetic cryptographic salt & iv for simulation
        const iv = Array.from({ length: 12 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, '0'),
        ).join('')
        const tagSig = Array.from({ length: 16 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, '0'),
        ).join('')

        // Encode to base64url payload
        const base64Data = btoa(unescape(encodeURIComponent(dataStr)))
        const ciphertext = `tc_e2ee:v1:${tag}:${iv}:${base64Data}:${tagSig}`
        ciphertexts.push(ciphertext)
      }

      return ciphertexts
    },
    [authenticated, user, hasRealmRole],
  )

  // TideCloak Browser E2EE Decrypt
  const doDecrypt = useCallback(
    async (items: Array<{ encrypted: string; tags: string[] }>): Promise<string[]> => {
      if (!authenticated || !user) {
        throw new Error('TideCloak E2EE Error: User must be signed in to perform decryption.')
      }

      const results: string[] = []

      for (const item of items) {
        const tag = item.tags[0]
        const requiredRole = `_tide_${tag}.selfdecrypt`

        // Check if the current user possesses the required decrypt role
        if (!hasRealmRole(requiredRole)) {
          throw new Error(
            `TideCloak E2EE Policy Denial: Active session '${user.identityId}' lacks required realm role '${requiredRole}' for tag '${tag}'.`,
          )
        }

        const parts = item.encrypted.split(':')
        if (parts.length >= 6 && parts[0] === 'tc_e2ee' && parts[1] === 'v1') {
          const base64Data = parts[4]
          const plaintext = decodeURIComponent(escape(atob(base64Data)))
          results.push(plaintext)
        } else {
          throw new Error('TideCloak E2EE Error: Invalid ciphertext structure or tag integrity failure.')
        }
      }

      return results
    },
    [authenticated, user, hasRealmRole],
  )

  const secureFetch = useCallback(
    async (url: string, init: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(init.headers || {})
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return fetch(url, { ...init, headers })
    },
    [token],
  )

  return (
    <AuthContext.Provider
      value={{
        isInitializing,
        authenticated,
        user,
        token,
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
