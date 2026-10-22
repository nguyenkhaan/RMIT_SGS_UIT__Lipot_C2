import { NextRequest, NextResponse } from 'next/server'
import { serverSessionVerifier } from '../../../lib/tidecloak/session-verifier'
import {
  isManagerAIncomeRevoked,
  setManagerAIncomeRevocation,
} from '../../../lib/demo/identities'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    revoked: isManagerAIncomeRevoked(),
    role: '_tide_income_manager_a.selfdecrypt',
    targetUser: 'manager-a',
    qeaThreshold: 1,
    qeaStatus: 'COMMITTED',
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session || session.businessRole !== 'auditor') {
    return NextResponse.json(
      { error: 'Forbidden: Only administrator / auditor role may execute QEA governance changes' },
      { status: 403 },
    )
  }

  const { action } = await request.json()
  if (action === 'revoke') {
    setManagerAIncomeRevocation(true)
    return NextResponse.json({
      success: true,
      action: 'revoked',
      role: '_tide_income_manager_a.selfdecrypt',
      targetUser: 'manager-a',
      message:
        'QEA proposal committed: role _tide_income_manager_a.selfdecrypt removed from manager-a. Renewal required for new token.',
    })
  } else if (action === 'restore') {
    setManagerAIncomeRevocation(false)
    return NextResponse.json({
      success: true,
      action: 'restored',
      role: '_tide_income_manager_a.selfdecrypt',
      targetUser: 'manager-a',
      message: 'Role restored to baseline matrix.',
    })
  }

  return NextResponse.json({ error: 'Invalid action. Must be revoke or restore' }, { status: 400 })
}
