'use client'

import React, { useState, useEffect } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export function AdminWorkspace({ packages }: { packages: RentalPackage[] }) {
  const { doDecrypt } = useTideAuth()
  const [govStatus, setGovStatus] = useState<{
    revoked: boolean
    role: string
    targetUser: string
  } | null>(null)
  const [govLoading, setGovLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const fetchGovStatus = async () => {
    try {
      const res = await fetch('/api/governance', { credentials: 'same-origin' })
      if (res.ok) {
        const data = await res.json()
        setGovStatus(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchGovStatus()
  }, [])

  const handleGovernanceAction = async (action: 'revoke' | 'restore') => {
    setGovLoading(true)
    try {
      const res = await fetch('/api/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        await fetchGovStatus()
      }
    } finally {
      setGovLoading(false)
    }
  }

  const handleAdminAttemptDecrypt = async (pkg: RentalPackage) => {
    setTestResult(null)
    try {
      await doDecrypt([
        {
          encrypted: pkg.protectedPayload,
          tags: [pkg.tag],
        },
      ])
      setTestResult('UNEXPECTED: Decryption succeeded. Security violation.')
    } catch (err: any) {
      setTestResult(`🛑 Access Denied: ${err.message}`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Administrative Audit & Governance Console
          </h1>
          <span className="badge badge-auditor">Auditor Session</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '780px' }}>
          As an Administrator / Auditor, you have access to operational metadata for auditability, but
          <strong> no capability</strong> to decrypt private evidence payloads. Package tags strictly protect payloads.
        </p>
      </div>

      {/* Safe Metadata Audit Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            Operational Metadata Audit (Safe Metadata Projection)
          </h3>
          <span className="badge badge-active">{packages.length} Total Packages</span>
        </div>

        {packages.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No packages submitted yet. Have the tenant submit evidence packages first.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={thStyle}>Package ID</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>Recipient</th>
                  <th style={thStyle}>Tag</th>
                  <th style={thStyle}>Payload Digest</th>
                  <th style={thStyle}>Admin Decrypt Test</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{pkg.id}</span>
                    </td>
                    <td style={tdStyle}>
                      <span className="badge badge-tag">{pkg.type}</span>
                    </td>
                    <td style={tdStyle}>@{pkg.ownerId}</td>
                    <td style={tdStyle}>@{pkg.recipientId}</td>
                    <td style={tdStyle}>
                      <span className="badge badge-tag">{pkg.tag}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b' }}>
                        {pkg.protectedPayload.slice(0, 24)}...
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleAdminAttemptDecrypt(pkg)}
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      >
                        Attempt Decrypt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {testResult && (
          <div style={denialAlertStyle}>
            {testResult}
          </div>
        )}
      </div>

      {/* Simulated Policy Governance & Role Revocation Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            Policy Governance & Role Revocation
          </h3>
          <span className="badge badge-tag">Simulated Governance Seam</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          When a decrypt role is revoked and committed, the affected recipient must renew their session; subsequent
          attempts to open the package are denied.
        </p>

        {govStatus && (
          <div style={govBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Target Account: <strong>@{govStatus.targetUser}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Permission: <code>{govStatus.role}</code>
                </div>
              </div>

              <div>
                {govStatus.revoked ? (
                  <span className="badge badge-auditor" style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid #f43f5e' }}>
                    🛑 REVOKED
                  </span>
                ) : (
                  <span className="badge badge-active">
                    ✓ ACTIVE (ASSIGNED)
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {!govStatus.revoked ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleGovernanceAction('revoke')}
                  disabled={govLoading}
                >
                  {govLoading ? 'Updating Policy...' : 'Revoke Role from Manager A'}
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleGovernanceAction('restore')}
                  disabled={govLoading}
                >
                  {govLoading ? 'Restoring...' : 'Restore Role to Manager A (Reset Demo)'}
                </button>
              )}
            </div>

            <div style={limitationBoxStyle}>
              ⚠️ <strong>Security Principle:</strong> Revocation prevents future authorised decryption after the
              governance change is committed and the session is renewed. It cannot retrospectively recall or erase
              plaintext data already viewed or downloaded by the recipient.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.85rem',
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: '#94a3b8',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const tdStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  color: '#f8fafc',
}

const denialAlertStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.85rem',
  borderRadius: '8px',
  background: 'rgba(244, 63, 94, 0.12)',
  border: '1px solid rgba(244, 63, 94, 0.35)',
  color: '#fecdd3',
  fontSize: '0.82rem',
}

const govBoxStyle: React.CSSProperties = {
  padding: '1.25rem',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.25)',
  border: '1px solid var(--border-subtle)',
}

const limitationBoxStyle: React.CSSProperties = {
  marginTop: '1.25rem',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  background: 'rgba(245, 158, 11, 0.08)',
  border: '1px solid rgba(245, 158, 11, 0.25)',
  color: '#fde68a',
  fontSize: '0.78rem',
  lineHeight: 1.4,
}
