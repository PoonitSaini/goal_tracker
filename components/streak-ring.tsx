"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"

interface StreakRingProps {
  days: number
  message?: string
  submessage?: string
  targetDays?: number
}

export function StreakRing({ 
  days = 42, 
  message = "Keep the fire burning!",
  submessage = "You're 8 days away from the 'Senior Architect' badge.",
  targetDays = 50
}: StreakRingProps) {
  const [animatedDays, setAnimatedDays] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedDays(days), 100)
    return () => clearTimeout(timer)
  }, [days])
  
  const progress = (animatedDays / targetDays) * 100
  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
      <div className="relative shrink-0 scale-90 sm:scale-100">
        <svg width={size} height={size} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-border"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#streakGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#39D353" />
              <stop offset="100%" stopColor="#26a641" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className="mb-1 h-8 w-8 text-primary" />
          <span className="text-5xl font-bold text-foreground">{animatedDays}</span>
          <span className="text-xs text-muted-foreground">DAYS</span>
        </div>
      </div>
      
      <div className="w-full min-w-0 flex-1 text-center sm:text-left">
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">{message}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{submessage}</p>
        
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {["LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4", "MILESTONE"].map((level, i) => (
            <div
              key={level}
              className={`shrink-0 flex-1 min-w-[4.5rem] rounded px-2 py-1 text-center text-[10px] font-mono ${
                i < Math.floor((progress / 100) * 5)
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {level}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
