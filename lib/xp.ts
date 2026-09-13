export const XP_PER_LEVEL = 500

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpProgressInLevel(xp: number): { current: number; max: number; percent: number } {
  const current = xp % XP_PER_LEVEL
  return {
    current,
    max: XP_PER_LEVEL,
    percent: Math.round((current / XP_PER_LEVEL) * 100),
  }
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL)
}
