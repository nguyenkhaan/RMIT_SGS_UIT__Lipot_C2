import type {
  AccessDecision,
  DemoIdentityId,
  RentalPackageType,
} from '../rental-passport/contracts'

const allowedPackageTypes: Record<DemoIdentityId, readonly RentalPackageType[]> = {
  admin: [],
  'manager-a': ['income'],
  'manager-b': ['reference'],
  tenant: ['income', 'reference'],
}

export function decidePackageAccess(
  identityId: DemoIdentityId,
  packageType: RentalPackageType,
): AccessDecision {
  if (allowedPackageTypes[identityId].includes(packageType)) {
    return { plaintext: '', source: 'temporary-adapter', status: 'granted' }
  }

  return {
    reason: 'This account is not assigned to this rental evidence package.',
    source: 'temporary-adapter',
    status: 'denied',
  }
}
