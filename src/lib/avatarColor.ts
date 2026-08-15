const FALLBACK_AVATAR_COLORS = ['#1e293b', '#a153ff', '#3b82f6', '#d43a20', '#71717a']

export const avatarColor = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 997
  return FALLBACK_AVATAR_COLORS[hash % FALLBACK_AVATAR_COLORS.length]
}
