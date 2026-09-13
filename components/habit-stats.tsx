"use client"

interface StatsRowProps {
  bestStreak?: number
  totalPushes?: string
  velocity?: string
}

export function HabitStats({ 
  bestStreak = 152, 
  totalPushes = "2.4k", 
  velocity = "+12.4%" 
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-1 font-mono text-xs text-accent">Best Streak</p>
        <p className="text-2xl font-bold text-foreground">{bestStreak} Days</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-1 font-mono text-xs text-accent">Total Pushes</p>
        <p className="text-2xl font-bold text-foreground">{totalPushes}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-1 font-mono text-xs text-accent">Velocity</p>
        <p className="text-2xl font-bold text-primary">{velocity}</p>
      </div>
    </div>
  )
}
