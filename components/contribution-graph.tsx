"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/components/providers/app-provider"
import { getContributionGrid, getMonthGrid, getTotalContributions } from "@/lib/contribution"
import { formatDisplayDate } from "@/lib/dates"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ContributionGraphProps {
  title?: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""]

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

export function ContributionGraph({
  title = "Coding Activity",
}: ContributionGraphProps) {
  const app = useApp()
  const [view, setView] = useState<"year" | "month">("year")
  const now = new Date()

  const yearGrid = useMemo(() => getContributionGrid(app), [app.dailyActivity])
  const monthGrid = useMemo(
    () => getMonthGrid(app, now.getFullYear(), now.getMonth()),
    [app.dailyActivity, now.getFullYear(), now.getMonth()]
  )
  const total = useMemo(() => getTotalContributions(app), [app.dailyActivity])

  const grid = view === "year" ? yearGrid : monthGrid

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            {total.toLocaleString()} activities recorded · {app.streak} day streak
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={view === "year" ? "default" : "outline"}
            onClick={() => setView("year")}
          >
            Year
          </Button>
          <Button
            size="sm"
            variant={view === "month" ? "default" : "outline"}
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <div className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-sm ${getContributionColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="-mx-2 max-w-full overflow-x-auto px-2 sm:mx-0 sm:px-0">
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2 pt-5">
              {DAYS.map((day, i) => (
                <div
                  key={i}
                  className="h-[10px] text-[10px] leading-[10px] text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div>
              {view === "year" && (
                <div className="mb-1 flex">
                  {yearGrid.map((_, weekIndex) => (
                    <div key={weekIndex} className="w-[12px] text-[10px] text-muted-foreground">
                      {weekIndex % 8 === 0 ? MONTHS[Math.floor((weekIndex / 52) * 12) % 12] : ""}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-[2px]">
                {grid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((cell, dayIndex) => {
                      const level = typeof cell === "number" ? cell : cell.level
                      const key = typeof cell === "number" ? "" : cell.key
                      const count = typeof cell === "number" ? cell : cell.count

                      if (!key && view === "month") {
                        return (
                          <div
                            key={dayIndex}
                            className="h-[10px] w-[10px] rounded-sm bg-transparent"
                          />
                        )
                      }

                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`h-[10px] w-[10px] rounded-sm transition-all hover:ring-1 hover:ring-primary/50 ${getContributionColor(level)}`}
                            />
                          </TooltipTrigger>
                          {key && (
                            <TooltipContent>
                              <p className="font-mono text-xs">
                                {formatDisplayDate(key)}: {count} activities
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
