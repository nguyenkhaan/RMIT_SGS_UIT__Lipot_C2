import { describe, expect, test } from 'bun:test'

import { hasTideCloakAdapterConfig } from '../lib/tidecloak/adapter-config'

describe('hasTideCloakAdapterConfig', () => {
  test('rejects the empty placeholder configuration', () => {
    expect(hasTideCloakAdapterConfig({})).toBe(false)
  })

  test('accepts an adapter with a server URL, realm, and client resource', () => {
    expect(
      hasTideCloakAdapterConfig({
        'auth-server-url': 'http://localhost:8080',
        realm: 'rental-passport',
        resource: 'rental-passport-web',
      }),
    ).toBe(true)
  })
})
