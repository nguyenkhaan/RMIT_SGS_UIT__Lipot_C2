import { NextRequest, NextResponse } from 'next/server'
import { serverSessionVerifier } from '../../../lib/tidecloak/session-verifier'
import {
  savePackage,
  listPackagesForUser,
  resetPackageStore,
} from '../../../lib/rental-packages/store'
import {
  PACKAGE_TAG_MAP,
  SIMULATED_PAYLOAD_PREFIX,
  type RentalPackage,
  type PackageTag,
  type RentalPackageType,
} from '../../../lib/rental-passport/contracts'

const MAX_REQUEST_BYTES = 32 * 1024 // 32 KB max request size
const ALLOWED_BODY_FIELDS = new Set(['type', 'recipientId', 'tag', 'protectedPayload'])

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid session' },
      { status: 401 },
    )
  }

  const packages = listPackagesForUser(session)
  return NextResponse.json({ packages }, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Point 7: Check request size
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large: Request exceeds 32KB limit' },
      { status: 413 },
    )
  }

  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid session' },
      { status: 401 },
    )
  }

  // Only Renter business role is authorized to submit new rental applications
  if (session.businessRole !== 'renter') {
    return NextResponse.json(
      { error: 'Forbidden: Only tenants with renter role can create packages' },
      { status: 403 },
    )
  }

  try {
    const rawText = await request.text()
    if (rawText.length > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: 'Payload too large: Request exceeds 32KB limit' },
        { status: 413 },
      )
    }

    const body = JSON.parse(rawText)

    // Point 7: Validate unknown fields
    for (const key of Object.keys(body)) {
      if (!ALLOWED_BODY_FIELDS.has(key)) {
        return NextResponse.json(
          { error: `Bad request: Unknown field '${key}' is not permitted` },
          { status: 400 },
        )
      }
    }

    // Point 7: Check for plaintext leakage
    const forbiddenKeys = ['monthlyIncome', 'employer', 'salary', 'previousProperty', 'referenceName']
    for (const key of forbiddenKeys) {
      if (key in body || rawText.includes(`"${key}"`)) {
        return NextResponse.json(
          {
            error: `Security violation: Plaintext property '${key}' rejected. Payload must be protected before transport.`,
          },
          { status: 400 },
        )
      }
    }

    const { type, recipientId, tag, protectedPayload } = body

    // Point 7: Strict type, tag, recipient validation
    if (type !== 'income' && type !== 'reference') {
      return NextResponse.json(
        { error: `Bad request: Invalid package type '${type}'. Must be 'income' or 'reference'.` },
        { status: 400 },
      )
    }

    const expectedConfig = PACKAGE_TAG_MAP[type as RentalPackageType]
    if (tag !== expectedConfig.tag) {
      return NextResponse.json(
        { error: `Bad request: Tag mismatch. Type '${type}' requires tag '${expectedConfig.tag}'.` },
        { status: 400 },
      )
    }

    if (recipientId !== expectedConfig.recipientId) {
      return NextResponse.json(
        { error: `Bad request: Recipient mismatch. Type '${type}' must be sent to '${expectedConfig.recipientId}'.` },
        { status: 400 },
      )
    }

    // Validate protectedPayload structure
    if (
      typeof protectedPayload !== 'string' ||
      protectedPayload.trim().length === 0 ||
      protectedPayload.length > 16384
    ) {
      return NextResponse.json(
        { error: 'Bad request: protectedPayload must be a non-empty string under 16KB.' },
        { status: 400 },
      )
    }

    if (!protectedPayload.startsWith(SIMULATED_PAYLOAD_PREFIX)) {
      return NextResponse.json(
        { error: `Bad request: protectedPayload format invalid. Must begin with '${SIMULATED_PAYLOAD_PREFIX}'.` },
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
        message: 'Protected package stored successfully',
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
    return NextResponse.json(
      { error: err?.message || 'Invalid JSON request' },
      { status: 400 },
    )
  }
}

// Point 6: Restrict DELETE /api/packages to development and Tenant/Admin roles
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Reset endpoint disabled in production' },
      { status: 403 },
    )
  }

  const session = await serverSessionVerifier.verifyRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 })
  }

  if (session.businessRole !== 'renter' && session.businessRole !== 'auditor') {
    return NextResponse.json(
      { error: 'Forbidden: Only tenant or administrator can reset package store' },
      { status: 403 },
    )
  }

  resetPackageStore()
  return NextResponse.json({ message: 'Package store reset to empty' }, { status: 200 })
}
