import type { Achievement, UserData } from "./types"

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  { id: "first_goal", title: "First Commit", description: "Complete your first goal", icon: "🎯", xpReward: 50, category: "goals" },
  { id: "goals_10", title: "Sprint Master", description: "Complete 10 goals", icon: "🏆", xpReward: 200, category: "goals" },
  { id: "streak_3", title: "On Fire", description: "Reach a 3-day streak", icon: "🔥", xpReward: 75, category: "streak" },
  { id: "streak_7", title: "Week Warrior", description: "Reach a 7-day streak", icon: "⚡", xpReward: 150, category: "streak" },
  { id: "streak_30", title: "Consistency King", description: "Reach a 30-day streak", icon: "👑", xpReward: 500, category: "streak" },
  { id: "pomodoro_1", title: "Deep Focus", description: "Complete your first pomodoro", icon: "🍅", xpReward: 25, category: "pomodoro" },
  { id: "pomodoro_25", title: "Flow State", description: "Complete 25 pomodoro sessions", icon: "🧠", xpReward: 300, category: "pomodoro" },
  { id: "habits_7", title: "Habit Builder", description: "Complete habits on 7 different days", icon: "✅", xpReward: 100, category: "habits" },
  { id: "level_5", title: "Rising Architect", description: "Reach level 5", icon: "📈", xpReward: 100, category: "level" },
  { id: "level_10", title: "Senior Dev", description: "Reach level 10", icon: "🚀", xpReward: 250, category: "level" },
]

function completedGoals(data: UserData) {
  return data.goals.filter((g) => g.status === "done").length
}

function habitActiveDays(data: UserData) {
  return Object.keys(data.habitCompletions).filter((d) => data.habitCompletions[d]?.length).length
}

function focusSessions(data: UserData) {
  return data.pomodoroSessions.filter((s) => s.phase === "focus").length
}

const checks: Record<string, (data: UserData) => boolean> = {
  first_goal: (d) => completedGoals(d) >= 1,
  goals_10: (d) => completedGoals(d) >= 10,
  streak_3: (d) => d.streak >= 3,
  streak_7: (d) => d.streak >= 7,
  streak_30: (d) => d.streak >= 30,
  pomodoro_1: (d) => focusSessions(d) >= 1,
  pomodoro_25: (d) => focusSessions(d) >= 25,
  habits_7: (d) => habitActiveDays(d) >= 7,
  level_5: (d) => d.level >= 5,
  level_10: (d) => d.level >= 10,
}

export function getNewlyUnlockedAchievements(data: UserData): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.filter(
    (a) => !data.unlockedAchievements.includes(a.id) && checks[a.id]?.(data)
  )
}

export function applyAchievementUnlocks(
  data: UserData,
  unlocked: Achievement[]
): UserData {
  if (!unlocked.length) return data
  const bonusXp = unlocked.reduce((sum, a) => sum + a.xpReward, 0)
  const newXp = data.xp + bonusXp
  return {
    ...data,
    xp: newXp,
    level: Math.floor(newXp / 500) + 1,
    unlockedAchievements: [
      ...data.unlockedAchievements,
      ...unlocked.map((a) => a.id),
    ],
  }
}
