import { describe, expect, test, beforeEach } from 'bun:test'
import {
  findDemoIdentity,
  setManagerAIncomeRevocation,
} from '../lib/demo/identities'
import { savePackage, resetPackageStore, listPackagesForUser } from '../lib/rental-packages/store'
import type { RentalPackage } from '../lib/rental-passport/contracts'

describe('TideCloak E2EE Access Matrix & Roles', () => {
  beforeEach(() => {
    setManagerAIncomeRevocation(false)
    resetPackageStore()
  })

  test('Tenant identity possesses all 4 E2EE realm roles', () => {
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

  test('Admin possesses auditor business role and NO E2EE decrypt roles', () => {
    const admin = findDemoIdentity('admin')!
    expect(admin.businessRole).toBe('auditor')
    expect(admin.realmRoles).not.toContain('_tide_income_manager_a.selfdecrypt')
    expect(admin.realmRoles).not.toContain('_tide_reference_manager_b.selfdecrypt')
    expect(admin.realmRoles).not.toContain('_tide_income_manager_a.selfencrypt')
    expect(admin.realmRoles).not.toContain('_tide_reference_manager_b.selfencrypt')
  })

  test('Governed QEA revocation revokes income decrypt role from Manager A', () => {
    // 1. Initial baseline: Manager A has role
    expect(findDemoIdentity('manager-a')!.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')

    // 2. QEA proposal committed: revoke role
    setManagerAIncomeRevocation(true)

    // 3. Renewed session: Manager A no longer has the role
    expect(findDemoIdentity('manager-a')!.realmRoles).not.toContain('_tide_income_manager_a.selfdecrypt')

    // 4. Restore role
    setManagerAIncomeRevocation(false)
    expect(findDemoIdentity('manager-a')!.realmRoles).toContain('_tide_income_manager_a.selfdecrypt')
  })

  test('Ciphertext store rejects unencrypted sensitive plaintext properties', () => {
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

  test('Ciphertext store accepts authentic TideCloak ciphertext format', () => {
    const validPackage: RentalPackage = {
      id: 'pkg-income-01',
      type: 'income',
      ownerId: 'tenant',
      recipientId: 'manager-a',
      tag: 'income_manager_a',
      protectedPayload: 'tc_e2ee:v1:income_manager_a:a819fc01:eyJhcHBsaWNhbnQiOiAiQWxleCJ9:9981abf0',
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
