'use client'

import React, { useState } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import type { DemoIdentityId } from '../lib/rental-passport/contracts'

const DEMO_ACCOUNTS: Array<{
  id: DemoIdentityId
  name: string
  role: string
  description: string
  badgeClass: string
  tags: string[]
  icon: string
}> = [
  {
    id: 'tenant',
    name: 'Alex Morgan',
    role: 'renter',
    description: 'Tenant applicant: prepares and protects both evidence packages; authorized for both.',
    badgeClass: 'badge-renter',
    tags: ['income_manager_a', 'reference_manager_b'],
    icon: '👤',
  },
  {
    id: 'manager-a',
    name: 'Priya Shah',
    role: 'property-manager',
    description: 'Property Manager A: authorized for Income Pack; denied for Reference Pack.',
    badgeClass: 'badge-manager',
    tags: ['income_manager_a (decrypt role)'],
    icon: '🏢',
  },
  {
    id: 'manager-b',
    name: 'Noah Williams',
    role: 'property-manager',
    description: 'Property Manager B: authorized for Reference Pack; denied for Income Pack.',
    badgeClass: 'badge-manager',
    tags: ['reference_manager_b (decrypt role)'],
    icon: '🏘️',
  },
  {
    id: 'admin',
    name: 'Jordan Lee',
    role: 'auditor',
    description: 'Administrator: inspects package metadata; payload access is restricted.',
    badgeClass: 'badge-auditor',
    tags: ['Metadata only (No decrypt roles)'],
    icon: '🛡️',
  },
]

export function LoginView({ onClose }: { onClose?: () => void }) {
  const { login } = useTideAuth()
  const [selected, setSelected] = useState<DemoIdentityId>('tenant')
  const [authenticating, setAuthenticating] = useState(false)

  const handleLogin = async (id: DemoIdentityId) => {
    setAuthenticating(true)
    try {
      await login(id)
      if (onClose) onClose()
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div className="glass-panel" style={modalCardStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={tideBadgeStyle}>Target Realm: rental-passport</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>
            Select Demo Identity
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Choose an identity to test the selective access control matrix across independent roles.
          </p>
        </div>

        {/* Identity Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = selected === acc.id
            return (
              <div
                key={acc.id}
                onClick={() => setSelected(acc.id)}
                style={{
                  ...accountCardStyle,
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(0, 229, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div style={{ fontSize: '1.75rem' }}>{acc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                      {acc.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      (@{acc.id})
                    </span>
                    <span className={`badge ${acc.badgeClass}`}>
                      {acc.role}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {acc.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                    {acc.tags.map((t) => (
                      <span key={t} className="badge badge-tag">
                        tag: {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={authenticating}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLogin(acc.id)
                  }}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
                >
                  {authenticating && selected === acc.id ? 'Connecting...' : 'Sign In'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Security boundary note */}
        <div style={securityFooterStyle}>
          🔒 <strong>Zero Trust Architecture:</strong> No master admin key or backend decryption capability exists.
          Decryption permissions are enforced through tag-bound role checks at the integration seam.
        </div>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  padding: '1.5rem',
}

const modalCardStyle: React.CSSProperties = {
  maxWidth: '680px',
  width: '100%',
  padding: '2rem',
  background: '#101622',
  borderRadius: '16px',
}

const tideBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--accent-cyan)',
  background: 'rgba(0, 229, 255, 0.12)',
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  border: '1px solid rgba(0, 229, 255, 0.25)',
}

const accountCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid var(--border-subtle)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const securityFooterStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  padding: '0.75rem 1rem',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
  fontSize: '0.75rem',
  color: '#94a3b8',
  lineHeight: 1.4,
}
