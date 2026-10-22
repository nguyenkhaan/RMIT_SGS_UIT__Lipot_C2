import type { IdentitySession, SessionVerifier } from '../rental-passport/contracts'
import { getIdentityFromSessionId } from '../demo/identities'

export class SimulatedSessionVerifier implements SessionVerifier {
  async verifyRequest(request: Request): Promise<IdentitySession | null> {
    // Restrict mock session verifier to non-production environment
    if (process.env.NODE_ENV === 'production') {
      return null
    }

    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return null
    }

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=')
        return [k, decodeURIComponent(v.join('='))]
      }),
    )

    const sessionId = cookies['tc_demo_session']
    if (!sessionId) {
      return null
    }

    return getIdentityFromSessionId(sessionId)
  }
}

export const serverSessionVerifier = new SimulatedSessionVerifier()
