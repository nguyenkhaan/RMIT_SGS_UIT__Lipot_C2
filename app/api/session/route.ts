import { NextRequest, NextResponse } from 'next/server'
import { findDemoIdentity } from '../../../lib/demo/identities'
import { serverSessionVerifier } from '../../../lib/tidecloak/session-verifier'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 200 })
  }
  return NextResponse.json({ authenticated: true, session }, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { identityId } = await request.json()
    const identity = findDemoIdentity(identityId)

    if (!identity) {
      return NextResponse.json(
        { error: `Identity '${identityId}' not found in realm 'rental-passport'` },
        { status: 404 },
      )
    }

    const response = NextResponse.json(
      {
        authenticated: true,
        session: identity,
        token: identity.token,
      },
      { status: 200 },
    )

    // Set HTTP-only session cookie matching TideCloak session lifetime
    response.cookies.set('tc_session_token', identity.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600,
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to sign in' }, { status: 500 })
  }
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ authenticated: false, session: null }, { status: 200 })
  response.cookies.set('tc_session_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return response
}
