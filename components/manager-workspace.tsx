'use client'

import React, { useState } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import { PackageCard } from './package-card'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export function ManagerWorkspace({
  packages,
  allPackages,
}: {
  packages: RentalPackage[]
  allPackages: RentalPackage[]
}) {
  const { user } = useTideAuth()
  const [showAllForCrossTest, setShowAllForCrossTest] = useState(false)

  const isManagerA = user?.identityId === 'manager-a'
  const isManagerB = user?.identityId === 'manager-b'

  const targetRole = isManagerA
    ? '_tide_income_manager_a.selfdecrypt'
    : '_tide_reference_manager_b.selfdecrypt'

  const assignedPackageType = isManagerA ? 'Income Dossier' : 'Rental History & Reference'
  const oppositePackageType = isManagerA ? 'Rental History & Reference' : 'Income Dossier'

  const displayList = showAllForCrossTest ? allPackages : packages

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
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '740px' }}>
              You are signed in as <strong>{user?.displayName}</strong>. Your TideCloak realm role is{' '}
              <code>{targetRole}</code>. You are cryptographically authorised to decrypt only the{' '}
              <strong>{assignedPackageType}</strong>. Decrypting the <strong>{oppositePackageType}</strong> will be
              denied by TideCloak policy.
            </p>
          </div>

          <div>
            <button
              className={`btn ${showAllForCrossTest ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowAllForCrossTest(!showAllForCrossTest)}
              style={{ fontSize: '0.8rem' }}
            >
              {showAllForCrossTest ? 'Hide Cross-Package Test' : '⚡ Enable Cross-Package Denial Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Package List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {showAllForCrossTest ? 'All Submitted Packages (Cross-Package Negative Testing)' : 'Assigned Evidence Packages'}
          </h3>
          <span className="badge badge-tag">{displayList.length} Available</span>
        </div>

        {displayList.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No packages assigned yet. Please sign in as Tenant first to encrypt and publish evidence packages.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {displayList.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
