import { describe, expect, test, beforeEach } from 'bun:test'
import {
  findDemoIdentity,
  setManagerAIncomeRevocation,
} from '../lib/demo/identities'
import { savePackage, resetPackageStore, listPackagesForUser } from '../lib/rental-packages/store'
import { SIMULATED_PAYLOAD_PREFIX, type RentalPackage } from '../lib/rental-passport/contracts'

describe('Access Matrix & Policy Roles', () => {
  beforeEach(() => {
    setManagerAIncomeRevocation(false)
    resetPackageStore()
  })

  test('Tenant identity possesses all 4 simulated package roles', () => {
    const tenant = findDemoIdentity('tenant')!
    expect(tenant).toBeDefined()
    expect(tenant.businessRole).toBe('renter')
    expect(tenant.realmRoles).toContain('_tide_income_manager_a.selfencrypt')
    expect(tenant.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')
    expect(tenant.realmRoles).toContain('_tide_reference_manager_b.selfencrypt')
    expect(tenant.realmRoles).toContain('_tide_reference_manager_b.selfdecrypt')
  })

  test('Manager A possesses only income decrypt role in baseline matrix', () => {
    const managerA = findDemoIdentity('manager-a')!
    expect(managerA.businessRole).toBe('property-manager')
    expect(managerA.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')
    expect(managerA.realmRoles).not.toContain('_tide_reference_manager_b.selfdecrypt')
    expect(managerA.realmRoles).not.toContain('_tide_income_manager_a.selfencrypt')
  })

  test('Manager B possesses only reference decrypt role in baseline matrix', () => {
    const managerB = findDemoIdentity('manager-b')!
    expect(managerB.businessRole).toBe('property-manager')
    expect(managerB.realmRoles).toContain('_tide_reference_manager_b.selfdecrypt')
    expect(managerB.realmRoles).not.toContain('_tide_income_manager_a.selfdecrypt')
    expect(managerB.realmRoles).not.toContain('_tide_reference_manager_b.selfencrypt')
  })

  test('Admin possesses auditor business role and no package decrypt roles', () => {
    const admin = findDemoIdentity('admin')!
    expect(admin.businessRole).toBe('auditor')
    expect(admin.realmRoles).not.toContain('_tide_income_manager_a.selfdecrypt')
    expect(admin.realmRoles).not.toContain('_tide_reference_manager_b.selfdecrypt')
    expect(admin.realmRoles).not.toContain('_tide_income_manager_a.selfencrypt')
    expect(admin.realmRoles).not.toContain('_tide_reference_manager_b.selfencrypt')
  })

  test('Policy role revocation removes income decrypt role from Manager A', () => {
    // 1. Initial baseline: Manager A has role
    expect(findDemoIdentity('manager-a')!.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')

    // 2. Policy change: revoke role
    setManagerAIncomeRevocation(true)

    // 3. Renewed session: Manager A no longer has the role
    expect(findDemoIdentity('manager-a')!.realmRoles).not.toContain('_tide_income_manager_a.selfdecrypt')

    // 4. Restore role
    setManagerAIncomeRevocation(false)
    expect(findDemoIdentity('manager-a')!.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')
  })

  test('Package store rejects unencrypted sensitive plaintext properties', () => {
    const maliciousPackage: RentalPackage = {
      id: 'pkg-leak-01',
      type: 'income',
      ownerId: 'tenant',
      recipientId: 'manager-a',
      tag: 'income_manager_a',
      protectedPayload: '{"monthlyIncome": 7200, "employer": "Northstar Studio"}',
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    expect(() => savePackage(maliciousPackage)).toThrow('SECURITY VIOLATION')
  })

  test('Package store accepts valid protected payload format', () => {
    const validPackage: RentalPackage = {
      id: 'pkg-income-01',
      type: 'income',
      ownerId: 'tenant',
      recipientId: 'manager-a',
      tag: 'income_manager_a',
      protectedPayload: `${SIMULATED_PAYLOAD_PREFIX}income_manager_a:eyJhcHBsaWNhbnQiOiAiQWxleCJ9`,
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    expect(() => savePackage(validPackage)).not.toThrow()

    const admin = findDemoIdentity('admin')!
    const adminView = listPackagesForUser(admin)
    expect(adminView.length).toBe(1)
    expect(adminView[0].protectedPayload).toBe(validPackage.protectedPayload)
  })
})
