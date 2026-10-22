import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { TideCloakAuthProvider } from '../lib/tidecloak/auth-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rental Application Passport — TideCloak Selective Decryption',
  description: 'Cryptographically protected selective disclosure of rental application evidence through TideCloak',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TideCloakAuthProvider>{children}</TideCloakAuthProvider>
      </body>
    </html>
  )
}
