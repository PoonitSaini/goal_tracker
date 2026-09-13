export type GoalCategory = "DSA" | "WEB DEV" | "SQL" | "DATA ANALYTICS" | "AI/ML"
export type GoalPriority = "critical" | "high" | "medium" | "low"
export type GoalStatus = "todo" | "in-progress" | "done"

export interface Goal {
  id: string
  title: string
  description?: string
  category: GoalCategory
  priority: GoalPriority
  xp: number
  status: GoalStatus
  dueDate?: string
  progress?: number
  isDaily?: boolean
  createdAt: string
  completedAt?: string
}

export interface Habit {
  id: string
  name: string
  duration?: string
  category: string
  shortCode: string
}

export interface UserProfile {
  displayName: string
  email: string
  bio: string
}

export interface UserPreferences {
  pushNotifications: boolean
  darkMode: boolean
  keyboardShortcuts: boolean
  focusMinutes: number
  breakMinutes: number
}

export type PomodoroPhase = "focus" | "break" | "idle"

export interface PomodoroSession {
  id: string
  phase: "focus" | "break"
  durationMinutes: number
  completedAt: string
  goalTitle?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  category: "goals" | "streak" | "pomodoro" | "habits" | "level"
}

export interface UserData {
  profile: UserProfile
  preferences: UserPreferences
  goals: Goal[]
  habits: Habit[]
  streak: number
  longestStreak: number
  xp: number
  level: number
  lastActiveDate: string | null
  dailyActivity: Record<string, number>
  habitCompletions: Record<string, string[]>
  pomodoroSessions: PomodoroSession[]
  unlockedAchievements: string[]
  createdAt: string
}

export interface AuthUser {
  id: string
  username: string
  passwordHash: string
  salt: string
  createdAt: string
}

export interface AuthRegistry {
  users: AuthUser[]
  activeUserId: string | null
  sessionToken: string | null
}

export type ContributionView = "year" | "month"

// Legacy aliases for gradual migration in components
export type Task = Goal
export type TaskCategory = GoalCategory
export type TaskPriority = GoalPriority
export type TaskStatus = GoalStatus
