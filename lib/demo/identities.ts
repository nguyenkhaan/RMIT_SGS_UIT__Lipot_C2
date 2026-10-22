import type { DemoIdentityId, IdentitySession } from '../rental-passport/contracts'

type DemoIdentity = IdentitySession

// Dynamic QEA governed revocation state
let managerAIncomeDecryptionRevoked = false

export function isManagerAIncomeRevoked(): boolean {
  return managerAIncomeDecryptionRevoked
}

export function setManagerAIncomeRevocation(revoked: boolean): void {
  managerAIncomeDecryptionRevoked = revoked
}

function createMockJwt(username: string, roles: string[], vuid: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      iss: 'http://localhost:8080/realms/rental-passport',
      sub: `user-${username}`,
      preferred_username: username,
      realm_access: { roles },
      resource_access: {
        'rental-passport-web': { roles: roles.filter((r) => !r.startsWith('_tide_')) },
      },
      vuid,
      tideuserkey: `tuk-${username}-key`,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    }),
  ).toString('base64url')
  const signature = Buffer.from(`tidecloak_sig_${username}`).toString('base64url')
  return `${header}.${payload}.${signature}`
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
      token: createMockJwt(
        'tenant',
        [
          'default-roles-rental-passport',
          'renter',
          '_tide_income_manager_a.selfencrypt',
          '_tide_income_manager_a.selfdecrypt',
          '_tide_reference_manager_b.selfencrypt',
          '_tide_reference_manager_b.selfdecrypt',
        ],
        'vuid-tenant-alex-001',
      ),
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
      token: createMockJwt('manager-a', managerARealmRoles, 'vuid-manager-priya-002'),
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
      token: createMockJwt(
        'manager-b',
        [
          'default-roles-rental-passport',
          'property-manager',
          '_tide_reference_manager_b.selfdecrypt',
        ],
        'vuid-manager-noah-003',
      ),
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
      token: createMockJwt('admin', ['default-roles-rental-passport', 'auditor'], 'vuid-admin-jordan-004'),
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
