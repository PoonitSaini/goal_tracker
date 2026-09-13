"use client"

import { useEffect, useState } from "react"

interface DevLogEntry {
  time: string
  type: "command" | "system" | "reward" | "info" | "success" | "user"
  message: string
  highlight?: string
}

interface DevLogProps {
  entries?: DevLogEntry[]
}

const defaultEntries: DevLogEntry[] = [
  { time: "14:22:01", type: "command", message: '$ git commit -m "feat: core analytics engine"' },
  { time: "14:22:05", type: "system", message: 'SYSTEM: Task "Core Engine" moved to DONE' },
  { time: "14:22:06", type: "reward", message: "REWARD: +500 XP granted to @neo_dev" },
  { time: "15:01:44", type: "info", message: "INFO: Starting deployment pipeline..." },
  { time: "15:01:50", type: "success", message: "SUCCESS: Prod-Omega build verified." },
  { time: "16:10:12", type: "user", message: 'USER: @neo_dev started "Train Llama-3"' },
]

export function DevLog({ entries: initialEntries = defaultEntries }: DevLogProps) {
  const [entries, setEntries] = useState(initialEntries)
  const [visibleEntries, setVisibleEntries] = useState<DevLogEntry[]>([])
  const [cursorVisible, setCursorVisible] = useState(true)
  const [input, setInput] = useState("")

  useEffect(() => {
    setVisibleEntries([])
    entries.forEach((_, index) => {
      setTimeout(() => {
        setVisibleEntries(entries.slice(0, index + 1))
      }, index * 400)
    })
  }, [entries])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    const now = new Date()
    const time = now.toTimeString().slice(0, 8)
    setEntries((prev) => [
      ...prev,
      { time, type: "command", message: `$ ${cmd}` },
      { time, type: "system", message: `SYSTEM: Command received — "${cmd}"` },
    ])
    setInput("")
  }

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "command": return "text-accent"
      case "reward": return "text-primary"
      case "success": return "text-primary"
      case "user": return "text-foreground"
      case "system": return "text-foreground"
      default: return "text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm font-medium text-foreground">DEV_LOG</div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-mono text-xs text-muted-foreground">DONE</span>
          </div>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">12</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === 1 ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </div>

      <div className="h-[300px] overflow-auto p-4 font-mono text-xs">
        {visibleEntries.map((entry, index) => (
          <div key={index} className="mb-2">
            <span className="text-muted-foreground">[{entry.time}] </span>
            <span className={getTypeColor(entry.type)}>{entry.message}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-muted-foreground">[--:--:--] </span>
          <span className="text-muted-foreground">Waiting for input_</span>
          <span className={`ml-0.5 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>▌</span>
        </div>
      </div>

      <form className="border-t border-border px-4 py-3" onSubmit={handleCommand}>
        <div className="flex items-center gap-2">
          <span className="text-primary">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </form>
    </div>
  )
}
