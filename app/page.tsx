'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTideAuth } from '../lib/tidecloak/auth-provider'
import { Navbar } from '../components/navbar'
import { LoginView } from '../components/login-view'
import { TenantWorkspace } from '../components/tenant-workspace'
import { ManagerWorkspace } from '../components/manager-workspace'
import { AdminWorkspace } from '../components/admin-workspace'
import type { RentalPackage } from '../lib/rental-passport/contracts'

export default function HomePage() {
  const { authenticated, isInitializing, user, token } = useTideAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [packages, setPackages] = useState<RentalPackage[]>([])
  const [allPackages, setAllPackages] = useState<RentalPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)

  const fetchPackages = useCallback(async () => {
    if (!token) {
      setPackages([])
      setAllPackages([])
      return
    }

    setLoadingPackages(true)
    try {
      const res = await fetch('/api/packages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setPackages(data.packages || [])

        // If user is auditor, packages list has all packages.
        if (user?.businessRole === 'auditor') {
          setAllPackages(data.packages || [])
        } else {
          // Also fetch all packages for managers cross-package test
          setAllPackages(data.packages || [])
        }
      }
    } catch (e) {
      console.error('Failed to load packages:', e)
    } finally {
      setLoadingPackages(false)
    }
  }, [token, user])

  useEffect(() => {
    if (authenticated) {
      fetchPackages()
    }
  }, [authenticated, fetchPackages])

  const handleResetDemo = async () => {
    if (!confirm('Reset package store to empty state for a fresh demonstration?')) return
    await fetch('/api/packages', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPackages()
  }

  if (isInitializing) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle} />
        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1rem' }}>
          Connecting to TideCloak Realm <strong>rental-passport</strong>...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenLogin={() => setShowLoginModal(true)} />

      <main style={mainContentStyle}>
        {!authenticated ? (
          /* Signed Out Hero / Landing View */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={taglineBadgeStyle}>
              UNLOCKED Challenge • Prototype Verification
            </div>

            <h1 style={heroTitleStyle}>
              Selective Rental Evidence Decryption with <span style={highlightTextStyle}>TideCloak</span>
            </h1>

            <p style={heroSubtextStyle}>
              Eliminate the renter trust bottleneck. Instead of giving complete plaintext copies of private payslips and rental
              histories to every recipient and platform administrator, data is encrypted browser-to-browser with TideCloak E2EE tags.
              Authority derives strictly from TideCloak Realm Roles.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowLoginModal(true)}
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Sign In with TideCloak Account
              </button>
            </div>

            {/* Matrix Preview Cards */}
            <div style={matrixGridStyle}>
              <div className="glass-panel" style={matrixCardStyle}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👤</div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>Tenant</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Encrypts & Decrypts Both Packs
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                  Income: ALLOW • Reference: ALLOW
                </div>
              </div>

              <div className="glass-panel" style={matrixCardStyle}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏢</div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>Manager A</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Decryption restricted by Tag
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  Income: ALLOW • Reference: DENY
                </div>
              </div>

              <div className="glass-panel" style={matrixCardStyle}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏘️</div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>Manager B</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Decryption restricted by Tag
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                  Income: DENY • Reference: ALLOW
                </div>
              </div>

              <div className="glass-panel" style={matrixCardStyle}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>Admin / Auditor</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Zero Master Key / No Decryption
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                  Metadata: VIEW • Payloads: DENY
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Workspace View */
          <div>
            {user?.businessRole === 'renter' && (
              <TenantWorkspace packages={packages} onRefreshPackages={fetchPackages} />
            )}

            {user?.businessRole === 'property-manager' && (
              <ManagerWorkspace packages={packages} allPackages={allPackages} />
            )}

            {user?.businessRole === 'auditor' && (
              <AdminWorkspace packages={packages} />
            )}
          </div>
        )}
      </main>

      {/* Footer Matrix & Rehearsal Reset Bar */}
      <footer style={footerStyle}>
        <div style={footerContainerStyle}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            <span>Verification Standard: </span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Tenant [Allow/Allow]</span> •{' '}
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Manager A [Allow/Deny]</span> •{' '}
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>Manager B [Deny/Allow]</span> •{' '}
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>Admin [Deny/Deny + Audit]</span>
          </div>

          {authenticated && (
            <button
              className="btn btn-secondary"
              onClick={handleResetDemo}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
            >
              Reset Data Fixtures
            </button>
          )}
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && <LoginView onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}

const mainContentStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: '1280px',
  width: '100%',
  margin: '0 auto',
  padding: '2rem 1.5rem',
}

const loadingContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-primary)',
}

const spinnerStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  border: '3px solid rgba(0, 229, 255, 0.2)',
  borderTopColor: 'var(--accent-cyan)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

const taglineBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--accent-cyan)',
  background: 'rgba(0, 229, 255, 0.1)',
  padding: '0.35rem 0.95rem',
  borderRadius: '9999px',
  border: '1px solid rgba(0, 229, 255, 0.25)',
  marginBottom: '1rem',
}

const heroTitleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#fff',
  maxWidth: '820px',
  lineHeight: 1.2,
}

const highlightTextStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #00e5ff 0%, #2563eb 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const heroSubtextStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#94a3b8',
  maxWidth: '700px',
  marginTop: '1.25rem',
  lineHeight: 1.6,
}

const matrixGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
  width: '100%',
  maxWidth: '960px',
  marginTop: '3.5rem',
}

const matrixCardStyle: React.CSSProperties = {
  padding: '1.25rem',
  textAlign: 'center',
}

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-subtle)',
  background: 'rgba(10, 13, 20, 0.95)',
  padding: '0.85rem 1.5rem',
}

const footerContainerStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}
