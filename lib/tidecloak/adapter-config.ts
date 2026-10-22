type AdapterConfig = Record<string, unknown>

function hasRequiredString(config: AdapterConfig, field: string): boolean {
  return typeof config[field] === 'string' && config[field].length > 0
}

export function hasTideCloakAdapterConfig(config: AdapterConfig): boolean {
  const hasServerUrl =
    hasRequiredString(config, 'auth-server-url') ||
    hasRequiredString(config, 'authServerUrl') ||
    hasRequiredString(config, 'url')

  return hasServerUrl && hasRequiredString(config, 'realm') && hasRequiredString(config, 'resource')
}
