import type { DemoIdentityId, IdentitySession } from '../rental-passport/contracts'

type DemoIdentity = IdentitySession

// Dynamic simulated role revocation state
let managerAIncomeDecryptionRevoked = false

export function isManagerAIncomeRevoked(): boolean {
  return managerAIncomeDecryptionRevoked
}

export function setManagerAIncomeRevocation(revoked: boolean): void {
  managerAIncomeDecryptionRevoked = revoked
}

// In-memory store for opaque demo session tokens
const sessionStore = new Map<string, { identityId: DemoIdentityId; createdAt: number }>()

export function createDemoSession(identityId: DemoIdentityId): string {
  const sessionId = `demo_sess_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`
  sessionStore.set(sessionId, { identityId, createdAt: Date.now() })
  return sessionId
}

export function getIdentityFromSessionId(sessionId: string): DemoIdentity | null {
  const record = sessionStore.get(sessionId)
  if (!record) return null
  return findDemoIdentity(record.identityId)
}

export function invalidateDemoSession(sessionId: string): void {
  sessionStore.delete(sessionId)
}

export function getDemoIdentities(): Record<DemoIdentityId, DemoIdentity> {
  const managerARealmRoles = [
    'default-roles-rental-passport',
    'property-manager',
    ...(managerAIncomeDecryptionRevoked ? [] : ['_tide_income_manager_a.selfdecrypt']),
  ]

  return {
    tenant: {
      businessRole: 'renter',
      displayName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      identityId: 'tenant',
      realmRoles: [
        'default-roles-rental-passport',
        'renter',
        '_tide_income_manager_a.selfencrypt',
        '_tide_income_manager_a.selfdecrypt',
        '_tide_reference_manager_b.selfencrypt',
        '_tide_reference_manager_b.selfdecrypt',
      ],
      roles: ['renter'],
      tideuserkey: 'tuk-tenant-key-771a',
      vuid: 'vuid-tenant-alex-001',
    },
    'manager-a': {
      businessRole: 'property-manager',
      displayName: 'Priya Shah',
      email: 'priya.shah@northstarpm.example.com',
      identityId: 'manager-a',
      realmRoles: managerARealmRoles,
      roles: ['property-manager'],
      tideuserkey: 'tuk-manager-a-key-882b',
      vuid: 'vuid-manager-priya-002',
    },
    'manager-b': {
      businessRole: 'property-manager',
      displayName: 'Noah Williams',
      email: 'noah.williams@apexrealty.example.com',
      identityId: 'manager-b',
      realmRoles: [
        'default-roles-rental-passport',
        'property-manager',
        '_tide_reference_manager_b.selfdecrypt',
      ],
      roles: ['property-manager'],
      tideuserkey: 'tuk-manager-b-key-993c',
      vuid: 'vuid-manager-noah-003',
    },
    admin: {
      businessRole: 'auditor',
      displayName: 'Jordan Lee',
      email: 'jordan.lee@compliance.example.com',
      identityId: 'admin',
      realmRoles: ['default-roles-rental-passport', 'auditor'],
      roles: ['auditor'],
      tideuserkey: 'tuk-admin-key-004d',
      vuid: 'vuid-admin-jordan-004',
    },
  }
}

export function findDemoIdentity(identityId: string): DemoIdentity | null {
  const identities = getDemoIdentities()
  return identities[identityId as DemoIdentityId] ?? null
}

export function listDemoIdentities(): readonly DemoIdentity[] {
  return Object.values(getDemoIdentities())
}
