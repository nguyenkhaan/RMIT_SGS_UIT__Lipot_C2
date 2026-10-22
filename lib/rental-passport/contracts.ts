export type RentalPackageType = 'income' | 'reference'

export type PackageTag = 'income_manager_a' | 'reference_manager_b'

export type DemoIdentityId = 'tenant' | 'manager-a' | 'manager-b' | 'admin'

export type BusinessRole = 'renter' | 'property-manager' | 'auditor'

// Consolidated single source of truth for package tags, roles, and recipients
export const PACKAGE_TAG_MAP = {
  income: {
    tag: 'income_manager_a' as PackageTag,
    recipientId: 'manager-a' as DemoIdentityId,
    recipientName: 'Manager A (Priya Shah)',
    requiredDecryptRole: '_tide_income_manager_a.selfdecrypt',
    requiredEncryptRole: '_tide_income_manager_a.selfencrypt',
  },
  reference: {
    tag: 'reference_manager_b' as PackageTag,
    recipientId: 'manager-b' as DemoIdentityId,
    recipientName: 'Manager B (Noah Williams)',
    requiredDecryptRole: '_tide_reference_manager_b.selfdecrypt',
    requiredEncryptRole: '_tide_reference_manager_b.selfencrypt',
  },
} as const

export const SIMULATED_PAYLOAD_PREFIX = 'sim_payload:v1:'

export type IdentitySession = {
  businessRole: BusinessRole
  displayName: string
  identityId: DemoIdentityId
  roles: readonly string[]
  realmRoles: readonly string[]
  vuid: string
  tideuserkey: string
  email?: string
}

export type PackageMetadata = {
  id: string
  createdAt: string
  ownerId: string
  recipientId: string
  status: 'active' | 'revoked'
  tag: PackageTag
  type: RentalPackageType
}

export type RentalPackage = PackageMetadata & {
  protectedPayload: string
}

export type AccessDecision =
  | { status: 'granted'; plaintext: string; source: 'simulated-adapter' }
  | { reason: string; status: 'denied'; source: 'simulated-adapter' }
  | { reason: string; status: 'unavailable'; source: 'simulated-adapter' }

export interface IdentityGateway {
  getSession(): Promise<IdentitySession | null>
  signIn(identityId: DemoIdentityId): Promise<IdentitySession>
  signOut(): Promise<void>
}

export interface PackageProtectionGateway {
  createStoredPayload(plaintext: string, tag: PackageTag): Promise<string>
  requestAccess(rentalPackage: RentalPackage): Promise<AccessDecision>
}

export interface SessionVerifier {
  verifyRequest(request: Request): Promise<IdentitySession | null>
}
