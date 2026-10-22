import { NextRequest, NextResponse } from 'next/server'
import {
  findDemoIdentity,
  createDemoSession,
  invalidateDemoSession,
} from '../../../lib/demo/identities'
import { serverSessionVerifier } from '../../../lib/tidecloak/session-verifier'
import type { DemoIdentityId } from '../../../lib/rental-passport/contracts'

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Mock session endpoint disabled in production' },
      { status: 403 },
    )
  }

  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 200 })
  }
  return NextResponse.json({ authenticated: true, session }, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Point 4: Restrict mock session endpoint to non-production environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Mock session endpoint disabled in production' },
      { status: 403 },
    )
  }

  try {
    const { identityId } = await request.json()
    const identity = findDemoIdentity(identityId as DemoIdentityId)

    if (!identity) {
      return NextResponse.json(
        { error: `Identity '${identityId}' not found in demo registry` },
        { status: 404 },
      )
    }

    // Point 3: Generate opaque session identifier and set HTTP-only cookie
    const sessionId = createDemoSession(identity.identityId)

    // Return session data WITHOUT any fake token
    const response = NextResponse.json(
      {
        authenticated: true,
        session: identity,
      },
      { status: 200 },
    )

    response.cookies.set('tc_demo_session', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600,
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to establish demo session' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const sessionId = request.cookies.get('tc_demo_session')?.value
  if (sessionId) {
    invalidateDemoSession(sessionId)
  }

  const response = NextResponse.json({ authenticated: false, session: null }, { status: 200 })
  response.cookies.set('tc_demo_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return response
}
