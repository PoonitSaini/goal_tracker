"use client"

import { useMemo, useState } from "react"
import { KanbanColumn } from "@/components/kanban-board"
import { DevLog } from "@/components/dev-log"
import { GoalEditDialog } from "@/components/goal-edit-dialog"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/components/providers/app-provider"
import { xpToNextLevel } from "@/lib/xp"
import type { Goal } from "@/lib/types"

export function GoalsBoard() {
  const { goals, xp } = useApp()
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const todoGoals = useMemo(() => goals.filter((g) => g.status === "todo"), [goals])
  const inProgressGoals = useMemo(
    () => goals.filter((g) => g.status === "in-progress"),
    [goals]
  )
  const doneGoals = useMemo(() => goals.filter((g) => g.status === "done"), [goals])

  const weeklyProgress = useMemo(() => {
    if (goals.length === 0) return 0
    return Math.round((doneGoals.length / goals.length) * 100)
  }, [goals.length, doneGoals.length])

  return (
    <>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          <KanbanColumn
            title="TO DO"
            count={todoGoals.length}
            goals={todoGoals}
            status="todo"
            onEditGoal={setEditingGoal}
          />
          <KanbanColumn
            title="IN PROGRESS"
            count={inProgressGoals.length}
            goals={inProgressGoals}
            status="in-progress"
            onEditGoal={setEditingGoal}
          />
          <KanbanColumn
            title="DONE"
            count={doneGoals.length}
            goals={doneGoals}
            status="done"
            onEditGoal={setEditingGoal}
          />
        </div>

        <div className="space-y-4">
          <DevLog />
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">WEEKLY GOAL</span>
              <span className="font-mono text-sm text-primary">{weeklyProgress}%</span>
            </div>
            <Progress value={weeklyProgress} className="mb-3 h-2" />
            <h3 className="font-semibold text-foreground">
              {weeklyProgress >= 100 ? "Sprint Complete!" : "Sprint Progress"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {xpToNextLevel(xp)} XP to next level
            </p>
          </div>
        </div>
      </div>

      <GoalEditDialog
        goal={editingGoal}
        open={!!editingGoal}
        onOpenChange={(open) => !open && setEditingGoal(null)}
      />
    </>
  )
}

export function GoalsPageHeader() {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Personal Sprint</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Goals</h1>
      <p className="text-muted-foreground">Create, track, and complete your coding goals</p>
    </div>
  )
}
