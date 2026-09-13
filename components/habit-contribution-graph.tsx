"use client"

import { useMemo } from "react"
import { useApp } from "@/components/providers/app-provider"
import { getContributionGrid, getTotalContributions } from "@/lib/contribution"

function getContributionColor(level: number): string {
  const colors = [
    "bg-[#161B22]",
    "bg-[#0e4429]",
    "bg-[#006d32]",
    "bg-[#26a641]",
    "bg-[#39d353]",
  ]
  return colors[Math.min(level, 4)]
}

export function HabitContributionGraph() {
  const app = useApp()
  const grid = useMemo(() => getContributionGrid(app), [app.dailyActivity])
  const total = useMemo(() => getTotalContributions(app), [app.dailyActivity])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Activity Heatmap</h3>
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        {total} activities in the last year
      </p>
      <div className="overflow-x-auto">
        <div className="flex gap-[2px]">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className={`h-[8px] w-[8px] rounded-sm ${getContributionColor(level)}`}
                  title={`Level ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
