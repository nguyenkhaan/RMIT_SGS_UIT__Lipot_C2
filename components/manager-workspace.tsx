'use client'

import React from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import { PackageCard } from './package-card'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export function ManagerWorkspace({
  allPackages,
}: {
  packages: RentalPackage[]
  allPackages: RentalPackage[]
}) {
  const { user } = useTideAuth()

  const isManagerA = user?.identityId === 'manager-a'

  const targetRole = isManagerA
    ? '_tide_income_manager_a.selfdecrypt'
    : '_tide_reference_manager_b.selfdecrypt'

  const assignedTag = isManagerA ? 'income_manager_a' : 'reference_manager_b'
  const assignedTitle = isManagerA ? 'Income & Employment Package' : 'Rental History & Reference Package'
  const oppositeTitle = isManagerA ? 'Rental History & Reference Package' : 'Income & Employment Package'

  // Point 2: Manager A and Manager B can always test opening both allowed and denied packages
  const allowedPackages = allPackages.filter((p) => p.tag === assignedTag)
  const restrictedPackages = allPackages.filter((p) => p.tag !== assignedTag)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Property Manager Portal
              </h1>
              <span className="badge badge-manager">
                {isManagerA ? 'Manager A (Income Recipient)' : 'Manager B (Reference Recipient)'}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '780px' }}>
              Signed in as <strong>{user?.displayName}</strong>. Assigned decrypt permission is{' '}
              <code>{targetRole}</code>. You are permitted to open the{' '}
              <strong>{assignedTitle}</strong>. Attempting to open the <strong>{oppositeTitle}</strong> demonstrates
              the negative access-control denial.
            </p>
          </div>
        </div>
      </div>

      {/* Allowed Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            Authorised Evidence Packages (Expected: Access Granted)
          </h3>
          <span className="badge badge-active">{allowedPackages.length} Available</span>
        </div>

        {allowedPackages.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
            No matching packages available. Have the tenant submit an application package first.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {allowedPackages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>

      {/* Negative Testing Section (Point 2) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            Restricted Evidence Packages (Negative Test: Expected Policy Denial)
          </h3>
          <span className="badge badge-auditor" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            {restrictedPackages.length} Restricted
          </span>
        </div>

        {restrictedPackages.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
            No restricted packages available for negative testing.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {restrictedPackages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
