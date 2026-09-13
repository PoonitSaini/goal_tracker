"use client"

import { BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConsistencyCardProps {
  rate?: number
  tasksDone?: number
  milestones?: number
}

export function ConsistencyCard({ 
  rate = 98.2, 
  tasksDone = 128, 
  milestones = 12 
}: ConsistencyCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Active
        </Badge>
      </div>
      
      <div className="mb-4">
        <span className="text-4xl font-bold text-primary">{rate}%</span>
        <p className="text-sm text-muted-foreground">Consistency Rate</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-2xl font-bold text-foreground">{tasksDone}</span>
          <p className="font-mono text-xs text-muted-foreground">TASKS DONE</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-foreground">{milestones}</span>
          <p className="font-mono text-xs text-muted-foreground">MILESTONES</p>
        </div>
      </div>
    </div>
  )
}
