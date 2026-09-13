"use client"

import { useCallback, useEffect, useState } from "react"
import { Coffee, Play, Pause, RotateCcw, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/providers/app-provider"
import { toast } from "sonner"
import type { PomodoroPhase } from "@/lib/types"

export function PomodoroTimer({ compact = false }: { compact?: boolean }) {
  const { preferences, completePomodoro, goals } = useApp()
  const [phase, setPhase] = useState<PomodoroPhase>("idle")
  const [timeLeft, setTimeLeft] = useState(preferences.focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [activeGoal, setActiveGoal] = useState(
    () => goals.find((g) => g.status === "in-progress")?.title ?? "Deep work session"
  )

  const focusSeconds = preferences.focusMinutes * 60
  const breakSeconds = preferences.breakMinutes * 60

  const resetPhase = useCallback(
    (next: PomodoroPhase) => {
      setPhase(next)
      setIsRunning(false)
      if (next === "focus") setTimeLeft(focusSeconds)
      else if (next === "break") setTimeLeft(breakSeconds)
      else setTimeLeft(focusSeconds)
    },
    [focusSeconds, breakSeconds]
  )

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false)
      if (phase === "focus") {
        completePomodoro({
          phase: "focus",
          durationMinutes: preferences.focusMinutes,
          goalTitle: activeGoal,
        })
        toast.success("Focus session complete! +25 XP")
        resetPhase("break")
      } else if (phase === "break") {
        completePomodoro({
          phase: "break",
          durationMinutes: preferences.breakMinutes,
        })
        toast.message("Break complete — ready for another focus round")
        resetPhase("idle")
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isRunning,
    timeLeft,
    phase,
    completePomodoro,
    preferences.focusMinutes,
    preferences.breakMinutes,
    activeGoal,
    resetPhase,
  ])

  useEffect(() => {
    if (phase === "idle") setTimeLeft(focusSeconds)
  }, [preferences.focusMinutes, preferences.breakMinutes, phase, focusSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const phaseLabel =
    phase === "focus" ? "Focus" : phase === "break" ? "Break" : "Ready"

  const skipBreak = () => {
    setIsRunning(false)
    resetPhase("idle")
    toast.message("Break skipped — ready for focus")
  }

  const skipToBreak = () => {
    setIsRunning(false)
    if (phase === "focus") {
      completePomodoro({
        phase: "focus",
        durationMinutes: Math.max(
          1,
          preferences.focusMinutes - Math.floor(timeLeft / 60)
        ),
        goalTitle: activeGoal,
      })
      toast.success("Focus ended early — break started")
    }
    resetPhase("break")
  }

  return (
    <div className={`min-w-0 rounded-xl border border-border bg-card ${compact ? "p-4 sm:p-6" : "p-6 sm:p-8"}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isRunning ? "animate-pulse bg-primary" : "bg-muted-foreground"
            }`}
          />
          <span className="font-mono text-sm font-medium text-primary">
            {phaseLabel} Session
          </span>
        </div>
        {phase === "break" ? (
          <Coffee className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Timer className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className={`mb-4 text-center ${compact ? "" : "py-4"}`}>
        <div
          className={`font-mono font-bold tracking-tight text-foreground ${
            compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl md:text-7xl"
          }`}
        >
          {formatTime(timeLeft)}
        </div>
        {!compact && (
          <select
            value={activeGoal}
            onChange={(e) => setActiveGoal(e.target.value)}
            className="mt-4 w-full max-w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground sm:max-w-xs"
          >
            <option value="Deep work session">Deep work session</option>
            {goals
              .filter((g) => g.status !== "done")
              .map((g) => (
                <option key={g.id} value={g.title}>
                  {g.title}
                </option>
              ))}
          </select>
        )}
        {compact && (
          <p className="mt-2 truncate text-sm text-muted-foreground">{activeGoal}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            if (phase === "idle") resetPhase("focus")
            setIsRunning(!isRunning)
          }}
          className="min-w-0 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {phase === "idle" ? "Start Focus" : "Resume"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => resetPhase(phase === "break" ? "break" : phase === "focus" ? "focus" : "idle")}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {phase === "focus" && (
          <Button variant="outline" onClick={skipToBreak}>
            Skip to Break
          </Button>
        )}
        {phase === "break" && (
          <Button variant="outline" onClick={skipBreak}>
            Skip Break
          </Button>
        )}
      </div>
    </div>
  )
}
