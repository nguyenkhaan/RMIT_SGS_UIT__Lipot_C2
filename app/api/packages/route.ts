import { NextRequest, NextResponse } from 'next/server'
import { serverSessionVerifier } from '../../../lib/tidecloak/session-verifier'
import {
  savePackage,
  listPackagesForUser,
  resetPackageStore,
} from '../../../lib/rental-packages/store'
import type { RentalPackage, PackageTag, RentalPackageType } from '../../../lib/rental-passport/contracts'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid TideCloak bearer token' },
      { status: 401 },
    )
  }

  const packages = listPackagesForUser(session)
  return NextResponse.json({ packages }, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid TideCloak bearer token' },
      { status: 401 },
    )
  }

  // Only Renter business role is authorized to submit new rental applications
  if (session.businessRole !== 'renter') {
    return NextResponse.json(
      { error: 'Forbidden: Only tenants with renter business role can create rental packages' },
      { status: 403 },
    )
  }

  try {
    const body = await request.json()

    // Enforce absence of raw sensitive fields in persistence request
    const forbiddenKeys = ['monthlyIncome', 'employer', 'salary', 'previousProperty', 'referenceName']
    for (const key of forbiddenKeys) {
      if (key in body) {
        return NextResponse.json(
          {
            error: `Security violation: Plaintext property '${key}' rejected. Payload must be encrypted in browser via TideCloak E2EE before transport.`,
          },
          { status: 400 },
        )
      }
    }

    const { type, recipientId, tag, protectedPayload } = body

    if (!type || !recipientId || !tag || !protectedPayload) {
      return NextResponse.json(
        { error: 'Bad request: Missing required fields (type, recipientId, tag, protectedPayload)' },
        { status: 400 },
      )
    }

    // Verify tag matches recipient rule
    if (type === 'income' && (tag !== 'income_manager_a' || recipientId !== 'manager-a')) {
      return NextResponse.json(
        { error: 'Bad request: Tag and recipient mismatch for income package' },
        { status: 400 },
      )
    }
    if (type === 'reference' && (tag !== 'reference_manager_b' || recipientId !== 'manager-b')) {
      return NextResponse.json(
        { error: 'Bad request: Tag and recipient mismatch for reference package' },
        { status: 400 },
      )
    }

    const newPackage: RentalPackage = {
      id: `pkg-${type}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      ownerId: session.identityId,
      protectedPayload,
      recipientId,
      status: 'active',
      tag: tag as PackageTag,
      type: type as RentalPackageType,
    }

    savePackage(newPackage)

    return NextResponse.json(
      {
        message: 'Encrypted package stored successfully',
        package: {
          id: newPackage.id,
          type: newPackage.type,
          tag: newPackage.tag,
          recipientId: newPackage.recipientId,
          createdAt: newPackage.createdAt,
          status: newPackage.status,
        },
      },
      { status: 201 },
    )
  } catch (err: any) {
    console.error('Error processing package creation:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

// Reset store for clean testing / demo runs
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  resetPackageStore()
  return NextResponse.json({ message: 'Package store reset to empty' }, { status: 200 })
}
