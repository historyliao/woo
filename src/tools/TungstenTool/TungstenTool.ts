const unsupported = async () => ({
  content: [
    {
      type: 'text',
      text: 'TungstenTool is unavailable in the public npm build.',
    },
  ],
  isError: true,
})

export const TungstenTool = {
  name: 'TungstenTool',
  async description() {
    return 'Unavailable in the public npm build.'
  },
  prompt: '',
  isEnabled() {
    return false
  },
  needsPermissions() {
    return false
  },
  async call() {
    return unsupported()
  },
  async userFacingName() {
    return 'TungstenTool'
  },
}

export function clearSessionsWithTungstenUsage() {}

export function resetInitializationState() {}
