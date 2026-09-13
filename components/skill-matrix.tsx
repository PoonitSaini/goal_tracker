"use client"

import { useMemo } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts"
import { useApp } from "@/components/providers/app-provider"
import { getCategoryBreakdown } from "@/lib/analytics"

export function SkillMatrix() {
  const app = useApp()
  const data = useMemo(() => getCategoryBreakdown(app), [app.goals])

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Goal Categories</h3>
      <p className="mb-4 text-sm text-muted-foreground">Completion rate by category</p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#30363D" />
            <PolarAngleAxis dataKey="category" stroke="#8B949E" fontSize={10} />
            <Radar
              name="Completion %"
              dataKey="value"
              stroke="#58A6FF"
              fill="#58A6FF"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
