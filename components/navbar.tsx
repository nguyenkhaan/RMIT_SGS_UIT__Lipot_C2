'use client'

import React, { useState } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'

export function Navbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  const { authenticated, user, logout, renewSession } = useTideAuth()
  const [renewing, setRenewing] = useState(false)
  const [renewSuccess, setRenewSuccess] = useState(false)

  const handleRenew = async () => {
    setRenewing(true)
    try {
      await renewSession()
      setRenewSuccess(true)
      setTimeout(() => setRenewSuccess(false), 2500)
    } finally {
      setRenewing(false)
    }
  }

  const roleBadgeClass =
    user?.businessRole === 'renter'
      ? 'badge-renter'
      : user?.businessRole === 'property-manager'
      ? 'badge-manager'
      : 'badge-auditor'

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Brand */}
        <div style={brandGroupStyle}>
          <div style={logoIconStyle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div style={titleStyle}>Rental Passport</div>
            <div style={subtitleStyle}>Selective Rental Evidence Access Control</div>
          </div>
        </div>

        {/* System metadata pill */}
        <div style={systemBadgeStyle}>
          <span style={indicatorDotStyle} />
          <span>Realm: <strong>rental-passport</strong></span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Client: <strong>rental-passport-web</strong></span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>Simulation Mode: <strong>Active</strong></span>
        </div>

        {/* User state / Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {authenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={userCardStyle}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                    {user.displayName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    @{user.identityId}
                  </div>
                </div>
                <span className={`badge ${roleBadgeClass}`}>
                  {user.businessRole}
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={handleRenew}
                disabled={renewing}
                title="Renew session after permission changes"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
              >
                {renewing ? 'Renewing...' : renewSuccess ? '✓ Renewed' : '🔄 Renew Session'}
              </button>

              <button
                className="btn btn-danger"
                onClick={logout}
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenLogin}>
              Select Demo Identity
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

const headerStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--border-subtle)',
  background: 'rgba(10, 13, 20, 0.85)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0.85rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const brandGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
}

const logoIconStyle: React.CSSProperties = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #00e5ff 0%, #2563eb 100%)',
  color: '#0a0d14',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 15px rgba(0, 229, 255, 0.35)',
}

const titleStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: '1.05rem',
  letterSpacing: '-0.02em',
  color: '#fff',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
}

const systemBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  background: 'rgba(255, 255, 255, 0.04)',
  padding: '0.35rem 0.85rem',
  borderRadius: '9999px',
  border: '1px solid var(--border-subtle)',
  fontSize: '0.75rem',
  color: '#94a3b8',
}

const indicatorDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#10b981',
  boxShadow: '0 0 8px #10b981',
}

const userCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.35rem 0.75rem',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
}
