'use client'

import React, { useState } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export function PackageCard({ packageData }: { packageData: RentalPackage }) {
  const { doDecrypt, user } = useTideAuth()
  const [decrypting, setDecrypting] = useState(false)
  const [decryptedData, setDecryptedData] = useState<any | null>(null)
  const [policyDenial, setPolicyDenial] = useState<string | null>(null)

  const handleDecrypt = async () => {
    setDecrypting(true)
    setPolicyDenial(null)
    setDecryptedData(null)

    try {
      // Direct call to decrypt helper with the stored payload and exact tag
      const [plaintext] = await doDecrypt([
        {
          encrypted: packageData.protectedPayload,
          tags: [packageData.tag],
        },
      ])

      const parsed = JSON.parse(plaintext)
      setDecryptedData(parsed)
    } catch (err: any) {
      setPolicyDenial(err.message || 'Access denied by role policy')
    } finally {
      setDecrypting(false)
    }
  }

  const handleHide = () => {
    setDecryptedData(null)
    setPolicyDenial(null)
  }

  const isIncome = packageData.type === 'income'

  return (
    <div className="glass-panel" style={cardContainerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{isIncome ? '💼' : '📜'}</span>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              {isIncome ? 'Income & Employment Pack' : 'Rental History & Reference'}
            </h4>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              ID: {packageData.id}
            </div>
          </div>
        </div>
        <span className="badge badge-active">{packageData.status}</span>
      </div>

      {/* Metadata Attributes */}
      <div style={metaGridStyle}>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Owner:</span>
          <span style={metaValueStyle}>@{packageData.ownerId}</span>
        </div>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Target Recipient:</span>
          <span style={metaValueStyle}>@{packageData.recipientId}</span>
        </div>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Access Tag:</span>
          <span className="badge badge-tag" style={{ fontSize: '0.68rem' }}>
            {packageData.tag}
          </span>
        </div>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Created:</span>
          <span style={metaValueStyle}>
            {new Date(packageData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Protected Payload Preview Box */}
      <div style={ciphertextBannerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
            PROTECTED PAYLOAD:
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>🔒 Tag-Bound</span>
        </div>
        <div style={cipherHashTextStyle}>
          {packageData.protectedPayload.slice(0, 48)}...
        </div>
      </div>

      {/* Action / Result */}
      <div style={{ marginTop: '1.25rem' }}>
        {!decryptedData && !policyDenial ? (
          <button
            className="btn btn-decrypt"
            onClick={handleDecrypt}
            disabled={decrypting}
            style={{ width: '100%' }}
          >
            {decrypting ? 'Evaluating Access...' : '🔓 Open Package'}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleHide} style={{ width: '100%', marginBottom: '0.75rem' }}>
            Close Package / Reset View
          </button>
        )}

        {/* Success Plaintext View */}
        {decryptedData && (
          <div style={decryptedBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span>✓ Access Granted (Role Matched)</span>
            </div>
            {isIncome ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                <div>Applicant: <strong>{decryptedData.applicantName}</strong></div>
                <div>Employer: <strong>{decryptedData.employer}</strong> ({decryptedData.employmentType})</div>
                <div>Monthly Income: <strong>${decryptedData.monthlyIncome?.toLocaleString()} {decryptedData.currency}</strong></div>
                <div>Payslip Period: <strong>{decryptedData.payslipPeriod}</strong></div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                <div>Applicant: <strong>{decryptedData.applicantName}</strong></div>
                <div>Previous Property: <strong>{decryptedData.previousProperty}</strong></div>
                <div>Tenancy Period: <strong>{decryptedData.tenancyPeriod}</strong></div>
                <div>Reference Name: <strong>{decryptedData.referenceName}</strong></div>
                <div>Payment History: <strong>{decryptedData.paymentHistory}</strong></div>
              </div>
            )}
          </div>
        )}

        {/* Policy Denial View */}
        {policyDenial && (
          <div style={denialBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fda4af', fontWeight: 700, fontSize: '0.85rem' }}>
              <span>🛑 Access Denied: Policy Mismatch</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.4rem', lineHeight: 1.4 }}>
              {policyDenial}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Your active session lacks the required tag decrypt permission for this package.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const cardContainerStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

const metaGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem 1rem',
  marginTop: '1rem',
  padding: '0.75rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-subtle)',
}

const metaItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const metaLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#64748b',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const metaValueStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  color: '#f8fafc',
  fontWeight: 600,
  marginTop: '0.1rem',
}

const ciphertextBannerStyle: React.CSSProperties = {
  marginTop: '0.85rem',
  padding: '0.65rem 0.85rem',
  borderRadius: '6px',
  background: 'rgba(0, 0, 0, 0.35)',
  border: '1px solid var(--border-subtle)',
}

const cipherHashTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  color: '#94a3b8',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const decryptedBoxStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.85rem',
  borderRadius: '8px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  color: '#f8fafc',
}

const denialBoxStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.85rem',
  borderRadius: '8px',
  background: 'rgba(244, 63, 94, 0.12)',
  border: '1px solid rgba(244, 63, 94, 0.35)',
}
