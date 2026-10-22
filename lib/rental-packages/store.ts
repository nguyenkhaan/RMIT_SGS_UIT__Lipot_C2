import type {
  IdentitySession,
  RentalPackage,
  RentalPackageType,
  PackageTag,
} from '../rental-passport/contracts'

// In-memory ciphertext store: only stores ciphertext + safe metadata
const packageStore = new Map<string, RentalPackage>()

export function savePackage(pkg: RentalPackage): void {
  // Validate that stored payload does NOT contain raw JSON or sensitive keys
  if (
    pkg.protectedPayload.includes('"monthlyIncome"') ||
    pkg.protectedPayload.includes('"employer"') ||
    pkg.protectedPayload.includes('"previousProperty"')
  ) {
    throw new Error('SECURITY VIOLATION: Plaintext payload detected in storage layer. Must be ciphertext.')
  }

  packageStore.set(pkg.id, { ...pkg })
}

export function getPackage(id: string): RentalPackage | null {
  return packageStore.get(id) ?? null
}

export function listPackagesForUser(user: IdentitySession): RentalPackage[] {
  const allPackages = Array.from(packageStore.values())

  // Admin / Auditor: sees all packages for metadata audit, but payloads remain encrypted
  if (user.businessRole === 'auditor') {
    return allPackages
  }

  // Tenant / Renter: sees packages they created
  if (user.businessRole === 'renter') {
    return allPackages.filter((p) => p.ownerId === user.identityId)
  }

  // Property Manager: sees packages directed to them
  if (user.businessRole === 'property-manager') {
    return allPackages.filter((p) => p.recipientId === user.identityId)
  }

  return []
}

export function getAllPackagesSafe(): RentalPackage[] {
  return Array.from(packageStore.values())
}

export function resetPackageStore(): void {
  packageStore.clear()
}
