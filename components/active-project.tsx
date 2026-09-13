"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActiveProjectProps {
  title?: string
  description?: string
  status?: "in-progress" | "completed" | "paused"
  collaborators?: number
}

export function ActiveProject({
  title = "Neural Engine V2",
  description = "Optimizing low-latency execution for distributed graph computing clusters.",
  status = "in-progress",
  collaborators = 4,
}: ActiveProjectProps) {
  const statusMap = {
    "in-progress": { label: "IN PROGRESS", className: "bg-primary/10 text-primary border-primary/30" },
    "completed": { label: "COMPLETED", className: "bg-green-500/10 text-green-400 border-green-500/30" },
    "paused": { label: "PAUSED", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className={statusMap[status].className}>
              {statusMap[status].label}
            </Badge>
            <span className="text-xs text-muted-foreground">Active Project</span>
          </div>
          
          <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(collaborators, 3) }).map((_, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-card">
                  <AvatarImage src={`https://i.pravatar.cc/32?img=${i + 1}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            {collaborators > 3 && (
              <span className="text-xs text-muted-foreground">+{collaborators - 3}</span>
            )}
          </div>
        </div>
        
        {/* Code preview / decorative element */}
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-accent/5 to-transparent md:h-40 md:w-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-[10px] leading-tight text-primary/30">
              {`
function optimize(graph) {
  const nodes = graph.nodes;
  return nodes.map(n => ({
    ...n,
    latency: calc(n)
  }));
}
              `.trim()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
