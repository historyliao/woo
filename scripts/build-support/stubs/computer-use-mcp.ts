export const DEFAULT_GRANT_FLAGS = {
  clipboardRead: false,
  clipboardWrite: false,
  systemKeyCombos: false,
}

export const API_RESIZE_PARAMS = {}

export function targetImageSize() {
  return undefined
}

export function bindSessionContext() {
  return async () => ({
    isError: true,
    content: [{ type: 'text', text: 'computer use is unavailable in the public npm build' }],
  })
}

export function buildComputerUseTools() {
  return []
}

export function createComputerUseMcpServer() {
  return {
    setRequestHandler() {},
    async connect() {},
  }
}

export async function createComputerUseMcpServerForCli() {
  return createComputerUseMcpServer()
}
