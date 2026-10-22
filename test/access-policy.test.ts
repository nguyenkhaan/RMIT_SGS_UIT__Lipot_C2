import { describe, expect, test } from 'bun:test'

import { decidePackageAccess } from '../lib/rental-packages/access-policy'

describe('decidePackageAccess', () => {
  test('grants the tenant access to both package types', () => {
    expect(decidePackageAccess('tenant', 'income').status).toBe('granted')
    expect(decidePackageAccess('tenant', 'reference').status).toBe('granted')
  })

  test('grants Manager A only the income package', () => {
    expect(decidePackageAccess('manager-a', 'income').status).toBe('granted')
    expect(decidePackageAccess('manager-a', 'reference').status).toBe('denied')
  })

  test('grants Manager B only the reference package', () => {
    expect(decidePackageAccess('manager-b', 'income').status).toBe('denied')
    expect(decidePackageAccess('manager-b', 'reference').status).toBe('granted')
  })

  test('denies the administrator access to both package types', () => {
    expect(decidePackageAccess('admin', 'income').status).toBe('denied')
    expect(decidePackageAccess('admin', 'reference').status).toBe('denied')
  })
})
