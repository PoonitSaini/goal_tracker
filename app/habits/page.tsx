"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { StreakRing } from "@/components/streak-ring"
import { DailyHabits } from "@/components/daily-habits"
import { HabitContributionGraph } from "@/components/habit-contribution-graph"
import { useApp } from "@/components/providers/app-provider"
import { getConsistencyScore } from "@/lib/analytics"
import { useMemo } from "react"

export default function HabitsPage() {
  const app = useApp()
  const consistency = useMemo(() => getConsistencyScore(app), [app.dailyActivity])

  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Habits</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Daily routines and consistency tracking
          </p>
        </div>

        <div className="mb-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_280px]">
          <StreakRing
            days={app.streak}
            message="Keep your coding streak alive!"
            submessage={`Longest streak: ${app.longestStreak} days`}
            targetDays={Math.max(app.longestStreak + 7, 30)}
          />
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <p className="font-mono text-xs text-muted-foreground">CONSISTENCY</p>
            <p className="mt-2 text-3xl font-bold text-primary sm:text-4xl">{consistency}%</p>
            <p className="mt-1 text-sm text-muted-foreground">Active days in the last 30</p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              {app.habits.length} habits tracked
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-2">
          <DailyHabits />
          <HabitContributionGraph />
        </div>
      </PageContent>
    </DashboardLayout>
  )
}
