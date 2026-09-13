"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  showIcon?: boolean
}

export function CircularProgress({
  value,
  max,
  size = 140,
  strokeWidth = 8,
  label,
  sublabel,
  showIcon = false,
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (animatedValue / max) * 100
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
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
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#39D353" />
            <stop offset="100%" stopColor="#26a641" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {showIcon && (
          <Flame className="mb-1 h-6 w-6 text-primary" />
        )}
        <span className="text-3xl font-bold text-foreground">
          {label || Math.round(percentage) + "%"}
        </span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
