"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/components/providers/app-provider"
import type { GoalCategory, GoalPriority } from "@/lib/types"
import { toast } from "sonner"

interface QuickAddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickAddTaskDialog({ open, onOpenChange }: QuickAddTaskDialogProps) {
  const { addGoal } = useApp()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<GoalCategory>("WEB DEV")
  const [priority, setPriority] = useState<GoalPriority>("medium")
  const [xp, setXp] = useState("50")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      toast.error("Goal title is required")
      return
    }

    addGoal({
      title: trimmed,
      category,
      priority,
      xp: Math.max(10, Number.parseInt(xp, 10) || 50),
    })

    toast.success("Goal added")
    setTitle("")
    setXp("50")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Quick Add Goal</DialogTitle>
            <DialogDescription>
              Add a new goal to your board. It will appear in the To Do column.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fix auth middleware"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["DSA", "WEB DEV", "AI/ML", "DATA ANALYTICS", "SQL"] as GoalCategory[]).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as GoalPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["critical", "high", "medium", "low"] as GoalPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-xp">XP Reward</Label>
              <Input
                id="task-xp"
                type="number"
                min={10}
                value={xp}
                onChange={(e) => setXp(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Add Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
