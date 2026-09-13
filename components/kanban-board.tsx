"use client"

import { Badge } from "@/components/ui/badge"
import { ChevronRight, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/components/providers/app-provider"
import { QuickAddTrigger } from "@/components/quick-add-trigger"
import type { Goal, GoalStatus } from "@/lib/types"

export type { Goal as Task }

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
}

const categoryColors: Record<string, string> = {
  DSA: "bg-accent/10 text-accent border-accent/30",
  "WEB DEV": "bg-primary/10 text-primary border-primary/30",
  "AI/ML": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "DATA ANALYTICS": "bg-orange-500/10 text-orange-400 border-orange-500/30",
  "SQL": "bg-pink-500/10 text-pink-400 border-pink-500/30",
}

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  low: "bg-muted text-muted-foreground border-border",
}

const nextStatus: Record<GoalStatus, GoalStatus | null> = {
  todo: "in-progress",
  "in-progress": "done",
  done: null,
}

const statusLabels: Record<GoalStatus, string> = {
  todo: "Start",
  "in-progress": "Complete",
  done: "Done",
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const { updateGoalStatus, removeGoal } = useApp()
  const advance = nextStatus[goal.status]

  return (
    <div className="group min-w-0 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-3 flex items-start justify-between">
        <Badge variant="outline" className={categoryColors[goal.category]}>
          {goal.category}
          {goal.isDaily && " · Daily"}
        </Badge>
        <span className="font-mono text-xs text-primary">+{goal.xp} XP</span>
      </div>

      <h3 className="mb-2 break-words font-semibold text-foreground">{goal.title}</h3>

      {goal.description && (
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{goal.description}</p>
      )}

      {goal.progress !== undefined && goal.status !== "done" && (
        <div className="mb-3">
          <div className="mb-1 text-xs text-muted-foreground">{goal.progress}% complete</div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {goal.dueDate && <span>Due: {goal.dueDate}</span>}
        </div>

        <div className="flex items-center gap-1">
          <Badge variant="outline" className={`text-[10px] ${priorityColors[goal.priority]}`}>
            {goal.priority === "critical" && "! "}
            {goal.priority.toUpperCase()}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
            onClick={() => onEdit(goal)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {advance && (
                <DropdownMenuItem onClick={() => updateGoalStatus(goal.id, advance)}>
                  Move to {statusLabels[goal.status]}
                </DropdownMenuItem>
              )}
              {goal.status !== "todo" && (
                <DropdownMenuItem
                  onClick={() =>
                    updateGoalStatus(
                      goal.id,
                      goal.status === "done" ? "in-progress" : "todo"
                    )
                  }
                >
                  Move back
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => removeGoal(goal.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export const TaskCard = GoalCard

interface KanbanColumnProps {
  title: string
  count: number
  goals: Goal[]
  status: "todo" | "in-progress" | "done"
  onEditGoal: (goal: Goal) => void
}

export function KanbanColumn({ title, count, goals, status, onEditGoal }: KanbanColumnProps) {
  const statusColors = {
    todo: "bg-muted-foreground",
    "in-progress": "bg-yellow-500",
    done: "bg-primary",
  }

  return (
    <div className="flex w-[min(100%,280px)] shrink-0 snap-center flex-col sm:w-[300px]">
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
        <h3 className="font-mono text-sm font-medium text-foreground">{title}</h3>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {count}
        </span>
        {status === "todo" && (
          <QuickAddTrigger />
        )}
      </div>
      
      <div className="flex flex-1 flex-col gap-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={onEditGoal} />
        ))}

        {status === "in-progress" && goals.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
            Move a goal here to start
          </div>
        )}
      </div>
    </div>
  )
}
