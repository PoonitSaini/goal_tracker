"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useApp } from "@/components/providers/app-provider"
import { getWeeklyXp } from "@/lib/analytics"

export function WeeklyXPChart() {
  const app = useApp()
  const data = useMemo(() => getWeeklyXp(app), [app.goals, app.pomodoroSessions])

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Weekly XP</h3>
      <p className="mb-4 text-sm text-muted-foreground">Goals completed and focus sessions</p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#39D353" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#39D353" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis dataKey="day" stroke="#8B949E" fontSize={12} />
            <YAxis stroke="#8B949E" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161B22",
                border: "1px solid #30363D",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E6EDF3" }}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="#39D353"
              fill="url(#xpGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
