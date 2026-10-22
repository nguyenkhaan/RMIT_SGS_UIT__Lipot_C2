import type {
  IdentitySession,
  RentalPackage,
} from '../rental-passport/contracts'

// In-memory store: only stores protected payload + safe metadata
const packageStore = new Map<string, RentalPackage>()

export function savePackage(pkg: RentalPackage): void {
  // Validate that stored payload does NOT contain raw JSON or sensitive keys
  if (
    pkg.protectedPayload.includes('"monthlyIncome"') ||
    pkg.protectedPayload.includes('"employer"') ||
    pkg.protectedPayload.includes('"previousProperty"') ||
    pkg.protectedPayload.includes('"referenceName"')
  ) {
    throw new Error('SECURITY VIOLATION: Plaintext payload detected in storage layer. Must be protected payload.')
  }

  packageStore.set(pkg.id, { ...pkg })
}

export function getPackage(id: string): RentalPackage | null {
  return packageStore.get(id) ?? null
}

export function listPackagesForUser(user: IdentitySession): RentalPackage[] {
  const allPackages = Array.from(packageStore.values())

  // Auditor: sees all packages for metadata audit, but payloads remain protected
  if (user.businessRole === 'auditor') {
    return allPackages
  }

  // Renter: sees packages they created
  if (user.businessRole === 'renter') {
    return allPackages.filter((p) => p.ownerId === user.identityId)
  }

  // Property Manager: can access packages directed to them or view for access evaluation
  if (user.businessRole === 'property-manager') {
    return allPackages
  }

  return []
}

export function getAllPackagesSafe(): RentalPackage[] {
  return Array.from(packageStore.values())
}

export function resetPackageStore(): void {
  packageStore.clear()
}
