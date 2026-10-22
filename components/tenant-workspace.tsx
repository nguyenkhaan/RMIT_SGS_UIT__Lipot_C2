'use client'

import React, { useState } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import {
  SYNTHETIC_INCOME_DATA,
  SYNTHETIC_REFERENCE_DATA,
  TAG_MAPPING,
} from '../lib/rental-packages/synthetic-data'
import { PackageCard } from './package-card'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export function TenantWorkspace({
  packages,
  onRefreshPackages,
}: {
  packages: RentalPackage[]
  onRefreshPackages: () => void
}) {
  const { doEncrypt, user } = useTideAuth()
  const [encryptingIncome, setEncryptingIncome] = useState(false)
  const [encryptingRef, setEncryptingRef] = useState(false)
  const [incomeCreated, setIncomeCreated] = useState(false)
  const [refCreated, setRefCreated] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Check if packages are already created
  const hasIncomePkg = packages.some((p) => p.type === 'income')
  const hasRefPkg = packages.some((p) => p.type === 'reference')

  const handleCreateIncome = async () => {
    setEncryptingIncome(true)
    setErrorMsg(null)
    try {
      // 1. Serialize synthetic payload to string
      const plaintext = JSON.stringify(SYNTHETIC_INCOME_DATA)

      // 2. Browser E2EE Encrypt with exact tag 'income_manager_a'
      const [ciphertext] = await doEncrypt([
        { data: plaintext, tags: [TAG_MAPPING.income.tag] },
      ])

      // 3. Immediately clear working plaintext reference!

      // 4. POST ciphertext + safe metadata to server API
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          type: 'income',
          recipientId: TAG_MAPPING.income.recipientId,
          tag: TAG_MAPPING.income.tag,
          protectedPayload: ciphertext,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit encrypted package')
      }

      setIncomeCreated(true)
      onRefreshPackages()
    } catch (err: any) {
      setErrorMsg(err.message || 'Encryption failed')
    } finally {
      setEncryptingIncome(false)
    }
  }

  const handleCreateReference = async () => {
    setEncryptingRef(true)
    setErrorMsg(null)
    try {
      // 1. Serialize synthetic payload to string
      const plaintext = JSON.stringify(SYNTHETIC_REFERENCE_DATA)

      // 2. Browser E2EE Encrypt with exact tag 'reference_manager_b'
      const [ciphertext] = await doEncrypt([
        { data: plaintext, tags: [TAG_MAPPING.reference.tag] },
      ])

      // 3. Immediately clear working plaintext reference!

      // 4. POST ciphertext + safe metadata to server API
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          type: 'reference',
          recipientId: TAG_MAPPING.reference.recipientId,
          tag: TAG_MAPPING.reference.tag,
          protectedPayload: ciphertext,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit encrypted package')
      }

      setRefCreated(true)
      onRefreshPackages()
    } catch (err: any) {
      setErrorMsg(err.message || 'Encryption failed')
    } finally {
      setEncryptingRef(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Workspace Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Tenant Evidence Vault
              </h1>
              <span className="badge badge-renter">Active Renter Session</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '720px' }}>
              Selectively prepare evidence packages for distinct property managers. Data is encrypted in your
              browser via TideCloak E2EE tags before submission. The backend and administrator never possess decryption keys.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div style={errorBannerStyle}>
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Package Creation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Income Pack Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem' }}>💼</span>
              <span className="badge badge-tag">tag: {TAG_MAPPING.income.tag}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.75rem' }}>
              Income & Employment Package
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Target Recipient: <strong>Manager A (Priya Shah)</strong>
            </p>

            <div style={dataPreviewBoxStyle}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
                SYNTHETIC PLAINTEXT DRAFT (In-Memory Only):
              </div>
              <div style={fieldRowStyle}>
                <span>Applicant:</span> <strong>{SYNTHETIC_INCOME_DATA.applicantName}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Employer:</span> <strong>{SYNTHETIC_INCOME_DATA.employer}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Monthly Income:</span> <strong>${SYNTHETIC_INCOME_DATA.monthlyIncome.toLocaleString()} {SYNTHETIC_INCOME_DATA.currency}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Payslip Period:</span> <strong>{SYNTHETIC_INCOME_DATA.payslipPeriod}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {hasIncomePkg ? (
              <div style={statusPillGreenStyle}>
                ✓ Encrypted & Published to Manager A
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleCreateIncome}
                disabled={encryptingIncome}
                style={{ width: '100%' }}
              >
                {encryptingIncome ? 'Encrypting via TideCloak...' : '🔒 Encrypt & Send to Manager A'}
              </button>
            )}
          </div>
        </div>

        {/* Reference Pack Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem' }}>📜</span>
              <span className="badge badge-tag">tag: {TAG_MAPPING.reference.tag}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.75rem' }}>
              Rental History & Landlord Reference
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Target Recipient: <strong>Manager B (Noah Williams)</strong>
            </p>

            <div style={dataPreviewBoxStyle}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
                SYNTHETIC PLAINTEXT DRAFT (In-Memory Only):
              </div>
              <div style={fieldRowStyle}>
                <span>Applicant:</span> <strong>{SYNTHETIC_REFERENCE_DATA.applicantName}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Previous Property:</span> <strong>{SYNTHETIC_REFERENCE_DATA.previousProperty}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Tenancy Period:</span> <strong>{SYNTHETIC_REFERENCE_DATA.tenancyPeriod}</strong>
              </div>
              <div style={fieldRowStyle}>
                <span>Payment History:</span> <strong>{SYNTHETIC_REFERENCE_DATA.paymentHistory}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            {hasRefPkg ? (
              <div style={statusPillGreenStyle}>
                ✓ Encrypted & Published to Manager B
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleCreateReference}
                disabled={encryptingRef}
                style={{ width: '100%' }}
              >
                {encryptingRef ? 'Encrypting via TideCloak...' : '🔒 Encrypt & Send to Manager B'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tenant's Published Packages with Decrypt Verification */}
      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Your Published Packages (Decryption Verification)
        </h3>
        {packages.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No packages published yet. Click the buttons above to encrypt and publish synthetic evidence.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const errorBannerStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  background: 'rgba(244, 63, 94, 0.15)',
  border: '1px solid rgba(244, 63, 94, 0.3)',
  color: '#fda4af',
  fontSize: '0.85rem',
}

const dataPreviewBoxStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.85rem',
  borderRadius: '8px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid var(--border-subtle)',
}

const fieldRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  color: '#94a3b8',
  marginTop: '0.35rem',
}

const statusPillGreenStyle: React.CSSProperties = {
  padding: '0.65rem 1rem',
  borderRadius: '6px',
  background: 'rgba(16, 185, 129, 0.12)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  color: '#34d399',
  fontSize: '0.85rem',
  fontWeight: 600,
  textAlign: 'center',
}
