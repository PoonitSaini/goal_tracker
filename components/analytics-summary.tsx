"use client"

import { useMemo } from "react"
import { useApp } from "@/components/providers/app-provider"
import {
  getCompletionRate,
  getConsistencyScore,
  getMonthlyTrend,
} from "@/lib/analytics"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function AnalyticsSummary() {
  const app = useApp()
  const completion = useMemo(() => getCompletionRate(app), [app.goals])
  const consistency = useMemo(() => getConsistencyScore(app), [app.dailyActivity])
  const monthly = useMemo(() => getMonthlyTrend(app), [app.goals])
  const focusCount = app.pomodoroSessions.filter((s) => s.phase === "focus").length

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Completion Rate", value: `${completion}%` },
        { label: "30-Day Consistency", value: `${consistency}%` },
        { label: "Focus Sessions", value: String(focusCount) },
        { label: "Longest Streak", value: `${app.longestStreak} days` },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}

      <div className="rounded-xl border border-border bg-card p-6 sm:col-span-2 lg:col-span-4">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Monthly XP Trend</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="month" stroke="#8B949E" fontSize={12} />
              <YAxis stroke="#8B949E" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161B22",
                  border: "1px solid #30363D",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="xp" fill="#39D353" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
