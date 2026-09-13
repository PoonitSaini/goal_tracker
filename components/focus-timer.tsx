"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FocusTimerProps {
  initialMinutes?: number
  task?: string
}

export function FocusTimer({ initialMinutes = 25, task = "Code Review Framework" }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime] = useState(initialMinutes * 60)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning)
  }, [isRunning])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(totalTime)
  }, [totalTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="font-mono text-sm font-medium text-primary">Focus Session</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4 text-center">
        <div className="font-mono text-6xl font-bold tracking-tight text-foreground">
          {formatTime(timeLeft)}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Task: {task}</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={toggleTimer}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Focus
            </>
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
