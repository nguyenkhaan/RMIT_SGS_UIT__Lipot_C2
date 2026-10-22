export type RentalPackageType = 'income' | 'reference'

export type PackageTag = 'income_manager_a' | 'reference_manager_b'

export type DemoIdentityId = 'tenant' | 'manager-a' | 'manager-b' | 'admin'

export type BusinessRole = 'renter' | 'property-manager' | 'auditor'

export type IdentitySession = {
  businessRole: BusinessRole
  displayName: string
  identityId: DemoIdentityId
  roles: readonly string[]
  realmRoles: readonly string[]
  vuid: string
  tideuserkey: string
  token: string
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
  | { status: 'granted'; plaintext: string; source: 'tidecloak-e2ee' | 'temporary-adapter' }
  | { reason: string; status: 'denied'; source: 'tidecloak-e2ee' | 'temporary-adapter' }
  | { reason: string; status: 'unavailable'; source: 'tidecloak-e2ee' | 'temporary-adapter' }

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
