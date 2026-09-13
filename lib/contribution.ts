import { getYearWeeks, toDateKey } from "./dates"
import type { UserData } from "./types"

export function getContributionLevel(count: number): number {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

export function recordActivity(
  data: UserData,
  amount = 1,
  dateKey = toDateKey()
): UserData {
  const current = data.dailyActivity[dateKey] ?? 0
  const next = Math.min(10, current + amount)
  return {
    ...data,
    dailyActivity: { ...data.dailyActivity, [dateKey]: next },
  }
}

export function getContributionGrid(data: UserData): number[][] {
  const weeks = getYearWeeks()
  return weeks.map((week) =>
    week.map(({ key }) => getContributionLevel(data.dailyActivity[key] ?? 0))
  )
}

export function getTotalContributions(data: UserData): number {
  return Object.values(data.dailyActivity).reduce((sum, n) => sum + n, 0)
}

export function getMonthGrid(
  data: UserData,
  year: number,
  month: number
): { key: string; level: number; count: number }[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const weeks: { key: string; level: number; count: number }[][] = []
  let week: { key: string; level: number; count: number }[] = []

  const padStart = (first.getDay() + 6) % 7
  for (let i = 0; i < padStart; i++) {
    week.push({ key: "", level: 0, count: 0 })
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d)
    const key = toDateKey(date)
    const count = data.dailyActivity[key] ?? 0
    week.push({ key, level: getContributionLevel(count), count })
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push({ key: "", level: 0, count: 0 })
    weeks.push(week)
  }
  return weeks
}
