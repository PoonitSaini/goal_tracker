"use client"

import { useMemo } from "react"
import { useApp } from "@/components/providers/app-provider"
import { formatDisplayDate } from "@/lib/dates"

export function PomodoroHistory() {
  const { pomodoroSessions } = useApp()

  const sessions = useMemo(
    () =>
      [...pomodoroSessions]
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
        .slice(0, 20),
    [pomodoroSessions]
  )

  const stats = useMemo(() => {
    const focus = pomodoroSessions.filter((s) => s.phase === "focus")
    const totalMinutes = focus.reduce((sum, s) => sum + s.durationMinutes, 0)
    return {
      total: pomodoroSessions.length,
      focus: focus.length,
      totalMinutes,
      today: focus.filter((s) => s.completedAt.startsWith(new Date().toISOString().slice(0, 10))).length,
    }
  }, [pomodoroSessions])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">TODAY</p>
          <p className="text-2xl font-bold text-foreground">{stats.today}</p>
          <p className="text-xs text-muted-foreground">focus sessions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">TOTAL FOCUS</p>
          <p className="text-2xl font-bold text-foreground">{stats.focus}</p>
          <p className="text-xs text-muted-foreground">sessions all time</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">FOCUS TIME</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalMinutes}</p>
          <p className="text-xs text-muted-foreground">minutes logged</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-semibold text-foreground">Session History</h3>
        </div>
        <div className="max-h-[400px] overflow-auto p-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pomodoro sessions yet. Start a focus timer!</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2"
                >
                  <span className={s.phase === "focus" ? "text-primary" : "text-accent"}>
                    {s.phase.toUpperCase()} · {s.durationMinutes}m
                  </span>
                  <span className="text-muted-foreground">
                    {s.goalTitle ?? "Break"} · {formatDisplayDate(s.completedAt.slice(0, 10))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
