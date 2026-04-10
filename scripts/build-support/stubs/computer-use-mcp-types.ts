export const DEFAULT_GRANT_FLAGS = {
  clipboardRead: false,
  clipboardWrite: false,
  systemKeyCombos: false,
}

export type CoordinateMode = 'absolute' | 'relative'
export type CuSubGates = Record<string, boolean>
export type CuPermissionRequest = Record<string, unknown>
export type CuPermissionResponse = Record<string, unknown>
