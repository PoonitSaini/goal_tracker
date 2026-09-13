"use client"

import { useEffect, useState } from "react"

interface TerminalWidgetProps {
  title?: string
  logs?: Array<{
    time: string
    type: "info" | "success" | "error" | "command" | "reward"
    message: string
  }>
}

const defaultLogs = [
  { time: "14:02", type: "info" as const, message: "system.init() ... OK" },
  { time: "14:05", type: "command" as const, message: 'git commit -m "refactor engine"' },
  { time: "14:12", type: "success" as const, message: "test_suite_alpha.run()" },
  { time: "14:15", type: "info" as const, message: "listening for focus_trigger..." },
  { time: "14:22", type: "command" as const, message: '$ git commit -m "feat: core analytics engine"' },
  { time: "14:22", type: "info" as const, message: 'SYSTEM: Task "Core Engine" moved to DONE' },
  { time: "14:22", type: "reward" as const, message: "REWARD: +500 XP granted to @neo_dev" },
  { time: "15:01", type: "info" as const, message: "INFO: Starting deployment pipeline..." },
  { time: "15:01", type: "success" as const, message: "SUCCESS: Prod-Omega build verified." },
]

export function TerminalWidget({ title = "active_log.sh", logs = defaultLogs }: TerminalWidgetProps) {
  const [visibleLogs, setVisibleLogs] = useState<typeof logs>([])
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    // Animate logs appearing one by one
    logs.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLogs(logs.slice(0, index + 1))
      }, index * 300)
    })
  }, [logs])

  useEffect(() => {
    // Blinking cursor
    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-primary"
      case "error":
        return "text-destructive"
      case "command":
        return "text-accent"
      case "reward":
        return "text-primary"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0a0e14]">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      
      {/* Terminal content */}
      <div className="h-[200px] overflow-auto p-4 font-mono text-xs">
        {visibleLogs.map((log, index) => (
          <div key={index} className="mb-1 flex">
            <span className="mr-3 text-muted-foreground">[{log.time}]</span>
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
        <div className="flex">
          <span className="mr-1 text-muted-foreground">[--:--:--]</span>
          <span className="text-muted-foreground">
            Waiting for input_
            <span className={cursorVisible ? "opacity-100" : "opacity-0"}>▌</span>
          </span>
        </div>
      </div>
    </div>
  )
}
