"use client"

import { Flame, Zap, Star } from "lucide-react"
import { CircularProgress } from "./circular-progress"

interface StatCardProps {
  type: "goal" | "streak" | "level"
  value: number
  max?: number
  label?: string
  sublabel?: string
}

export function StatCard({ type, value, max = 100, label, sublabel }: StatCardProps) {
  if (type === "goal") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6">
        <CircularProgress value={value} max={max} />
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label || "DAILY GOAL"}
        </p>
        <p className="text-sm text-foreground">{sublabel || `${value}/${max} Goals Done`}</p>
      </div>
    )
  }

  if (type === "streak") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6">
        <div className="relative flex h-[140px] w-[140px] items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-4 border-border" />
          </div>
          <div className="flex flex-col items-center">
            <Flame className="mb-1 h-8 w-8 text-primary" />
            <span className="text-4xl font-bold text-foreground">{value}</span>
          </div>
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label || "DAY STREAK"}
        </p>
        {sublabel ? (
          <p className="mt-1 text-sm text-muted-foreground">{sublabel}</p>
        ) : (
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i <= Math.min(value / 3, 5) ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (type === "level") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6">
        <CircularProgress value={value} max={max} label={label?.replace("LEVEL ", "") ?? ""} sublabel="" />
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label || "LEVEL PROGRESS"}
        </p>
        <p className="text-sm text-foreground">{sublabel}</p>
      </div>
    )
  }

  return null
}
