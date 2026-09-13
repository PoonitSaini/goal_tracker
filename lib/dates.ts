export function toDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getDaysBetween(a: string, b: string): number {
  const start = parseDateKey(a).getTime()
  const end = parseDateKey(b).getTime()
  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

export function formatDisplayDate(key: string): string {
  return parseDateKey(key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function getLastNDays(n: number): string[] {
  const keys: string[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    keys.push(toDateKey(addDays(today, -i)))
  }
  return keys
}

export function getYearWeeks(): { key: string; date: Date }[][] {
  const today = new Date()
  const start = addDays(today, -364)
  const weeks: { key: string; date: Date }[][] = []
  let current = new Date(start)
  while (current <= today) {
    const week: { key: string; date: Date }[] = []
    for (let d = 0; d < 7; d++) {
      week.push({ key: toDateKey(current), date: new Date(current) })
      current = addDays(current, 1)
      if (current > today) break
    }
    if (week.length) weeks.push(week)
  }
  return weeks
}
