"use client"

import { Check, Clock, FileText, GitPullRequest, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/components/providers/app-provider"
import { useState } from "react"
import { toast } from "sonner"

const habitIcons: Record<string, React.ReactNode> = {
  LC: <Clock className="h-4 w-4" />,
  PR: <GitPullRequest className="h-4 w-4" />,
  DOC: <FileText className="h-4 w-4" />,
}

export function DailyHabits() {
  const { habits, toggleHabitToday, isHabitDoneToday, addHabit, removeHabit } = useApp()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [shortCode, setShortCode] = useState("")
  const [duration, setDuration] = useState("")
  const [category, setCategory] = useState("General")

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    const code = shortCode.trim().toUpperCase().slice(0, 4)
    if (!trimmed || !code) {
      toast.error("Name and short code are required")
      return
    }
    addHabit({
      name: trimmed,
      shortCode: code,
      duration: duration.trim() || undefined,
      category: category.trim() || "General",
    })
    toast.success("Habit added")
    setName("")
    setShortCode("")
    setDuration("")
    setCategory("General")
    setDialogOpen(false)
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Daily Habits</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => {
          const completed = isHabitDoneToday(habit.id)
          const icon = habitIcons[habit.shortCode] ?? <Clock className="h-4 w-4" />
          return (
            <div
              key={habit.id}
              className={`group flex items-center gap-4 rounded-lg p-3 transition-all ${
                completed
                  ? "border border-primary/20 bg-primary/10"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <Checkbox
                checked={completed}
                onCheckedChange={() => toggleHabitToday(habit.id)}
                className="h-5 w-5 border-2"
              />
              <div className="flex-1">
                <p className={`font-medium ${completed ? "text-primary" : "text-foreground"}`}>
                  {habit.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {habit.duration && (
                    <>
                      {icon}
                      <span>{habit.duration}</span>
                      <span className="mx-1">•</span>
                    </>
                  )}
                  {completed ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-primary" />
                      Done today
                    </span>
                  ) : (
                    habit.category
                  )}
                </p>
              </div>
              <div
                className={`rounded-md px-2 py-1 font-mono text-xs font-medium ${
                  completed ? "bg-primary/20 text-primary" : "bg-accent/10 text-accent"
                }`}
              >
                {habit.shortCode}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                onClick={() => {
                  removeHabit(habit.id)
                  toast.success(`Removed "${habit.name}"`)
                }}
                aria-label={`Remove ${habit.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>

      <Button variant="outline" className="mt-4 w-full" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Habit
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddHabit}>
            <DialogHeader>
              <DialogTitle>New Habit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="habit-name">Name</Label>
                <Input id="habit-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="habit-code">Short code</Label>
                  <Input id="habit-code" value={shortCode} onChange={(e) => setShortCode(e.target.value)} maxLength={4} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="habit-category">Category</Label>
                  <Input id="habit-category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="habit-duration">Duration (optional)</Label>
                <Input id="habit-duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-primary-foreground">Add Habit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
