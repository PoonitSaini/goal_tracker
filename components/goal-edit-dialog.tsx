"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useApp } from "@/components/providers/app-provider"
import type { Goal, GoalCategory, GoalPriority } from "@/lib/types"
import { toast } from "sonner"

interface GoalEditDialogProps {
  goal: Goal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalEditDialog({ goal, open, onOpenChange }: GoalEditDialogProps) {
  const { updateGoal } = useApp()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<GoalCategory>("WEB DEV")
  const [priority, setPriority] = useState<GoalPriority>("medium")
  const [xp, setXp] = useState("50")
  const [isDaily, setIsDaily] = useState(false)

  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description ?? "")
      setCategory(goal.category)
      setPriority(goal.priority)
      setXp(String(goal.xp))
      setIsDaily(goal.isDaily ?? false)
    }
  }, [goal])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return
    const trimmed = title.trim()
    if (!trimmed) {
      toast.error("Title is required")
      return
    }
    updateGoal(goal.id, {
      title: trimmed,
      description: description.trim() || undefined,
      category,
      priority,
      xp: Math.max(10, Number.parseInt(xp, 10) || 50),
      isDaily,
    })
    toast.success("Goal updated")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["DSA", "WEB DEV", "SQL", "DATA ANALYTICS", "AI/ML"] as GoalCategory[]).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as GoalPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["critical", "high", "medium", "low"] as GoalPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-xp">XP Reward</Label>
              <Input id="edit-xp" type="number" min={10} value={xp} onChange={(e) => setXp(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-daily">Daily recurring goal</Label>
              <Switch id="edit-daily" checked={isDaily} onCheckedChange={setIsDaily} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
