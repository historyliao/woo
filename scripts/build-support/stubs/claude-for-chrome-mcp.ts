export const BROWSER_TOOLS: Array<{ name: string }> = []

export type ClaudeForChromeContext = Record<string, unknown>
export type Logger = {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
  debug?(message: string): void
}
export type PermissionMode =
  | 'ask'
  | 'skip_all_permission_checks'
  | 'follow_a_plan'

export function createClaudeForChromeMcpServer(): never {
  throw new Error(
    '@ant/claude-for-chrome-mcp is unavailable in the public npm build',
  )
}
