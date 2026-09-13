import { getLastNDays, toDateKey } from "./dates"
import type { GoalCategory, UserData } from "./types"

export interface WeeklyXpPoint {
  day: string
  xp: number
  goals: number
  pomodoros: number
}

export interface CategoryStat {
  category: GoalCategory
  completed: number
  total: number
  value: number
}

export function getWeeklyXp(data: UserData): WeeklyXpPoint[] {
  const days = getLastNDays(7)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return days.map((key) => {
    const goalsDone = data.goals.filter(
      (g) => g.status === "done" && g.completedAt?.startsWith(key)
    ).length
    const pomodoros = data.pomodoroSessions.filter(
      (s) => s.phase === "focus" && s.completedAt.startsWith(key)
    ).length
    const xp =
      data.goals
        .filter((g) => g.status === "done" && g.completedAt?.startsWith(key))
        .reduce((sum, g) => sum + g.xp, 0) + pomodoros * 25

    const date = new Date(key)
    return {
      day: dayLabels[date.getDay()],
      xp,
      goals: goalsDone,
      pomodoros,
    }
  })
}

export function getCategoryBreakdown(data: UserData): CategoryStat[] {
  const categories: GoalCategory[] = ["DSA", "WEB DEV", "SQL", "DATA ANALYTICS", "AI/ML"]
  return categories.map((category) => {
    const total = data.goals.filter((g) => g.category === category).length
    const completed = data.goals.filter(
      (g) => g.category === category && g.status === "done"
    ).length
    const value = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { category, completed, total, value }
  }).filter((c) => c.total > 0 || c.category === "WEB DEV")
}

export function getCompletionRate(data: UserData): number {
  if (!data.goals.length) return 0
  const done = data.goals.filter((g) => g.status === "done").length
  return Math.round((done / data.goals.length) * 100)
}

export function getMonthlyTrend(data: UserData): { month: string; xp: number }[] {
  const months: { month: string; xp: number }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const xp = data.goals
      .filter((g) => g.completedAt?.startsWith(prefix))
      .reduce((sum, g) => sum + g.xp, 0)
    months.push({
      month: d.toLocaleDateString(undefined, { month: "short" }),
      xp,
    })
  }
  return months
}

export function getConsistencyScore(data: UserData): number {
  const last30 = getLastNDays(30)
  const active = last30.filter((k) => (data.dailyActivity[k] ?? 0) > 0).length
  return Math.round((active / 30) * 100)
}

export function updateStreak(data: UserData, today = toDateKey()): UserData {
  if (!data.lastActiveDate) {
    return {
      ...data,
      streak: 1,
      longestStreak: Math.max(1, data.longestStreak),
      lastActiveDate: today,
    }
  }
  if (data.lastActiveDate === today) return data

  const yesterday = toDateKey(new Date(Date.now() - 86400000))
  let streak = data.streak
  if (data.lastActiveDate === yesterday) {
    streak += 1
  } else {
    streak = 1
  }
  return {
    ...data,
    streak,
    longestStreak: Math.max(streak, data.longestStreak),
    lastActiveDate: today,
  }
}
