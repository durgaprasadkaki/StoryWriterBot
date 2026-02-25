export const STORAGE_KEYS = {
  storyHistoryPrefix: 'storywriterbot.history.v1',
  authSession: 'storywriterbot.auth.v1',
  authUsers: 'storywriterbot.users.v1',
} as const

export function storyHistoryKeyForUser(userId: string) {
  return `${STORAGE_KEYS.storyHistoryPrefix}.${userId}`
}
