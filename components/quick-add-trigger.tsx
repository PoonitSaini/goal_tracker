"use client"

import { Button } from "@/components/ui/button"
import { useApp } from "@/components/providers/app-provider"

export function QuickAddTrigger() {
  const { setQuickAddOpen } = useApp()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto h-6 w-6"
      onClick={() => setQuickAddOpen(true)}
      aria-label="Add task"
    >
      <span className="text-lg">+</span>
    </Button>
  )
}
