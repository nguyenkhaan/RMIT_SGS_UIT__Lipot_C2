import { NextRequest } from 'next/server'
import type { IdentitySession, SessionVerifier } from '../rental-passport/contracts'
import { findDemoIdentity, getDemoIdentities } from '../demo/identities'

export class TideCloakSessionVerifier implements SessionVerifier {
  async verifyRequest(request: Request): Promise<IdentitySession | null> {
    const authHeader = request.headers.get('authorization')
    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim()
    } else {
      // Check cookies for session
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=')
            return [k, decodeURIComponent(v.join('='))]
          }),
        )
        token = cookies['tc_session_token'] ?? null
      }
    }

    if (!token) {
      return null
    }

    try {
      // Decode JWT parts
      const parts = token.split('.')
      if (parts.length !== 3) {
        return null
      }

      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8')
      const payload = JSON.parse(payloadJson)

      const username = payload.preferred_username
      if (!username) {
        return null
      }

      // Look up current demo identity with effective roles (including any QEA revocation changes)
      const identity = findDemoIdentity(username)
      if (!identity) {
        return null
      }

      // Check expiration if present
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }

      return identity
    } catch (err) {
      console.error('[TideCloak Token Verifier] Error verifying token:', err)
      return null
    }
  }
}

export const serverSessionVerifier = new TideCloakSessionVerifier()
