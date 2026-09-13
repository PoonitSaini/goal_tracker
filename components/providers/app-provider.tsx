"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { applyAchievementUnlocks, getNewlyUnlockedAchievements } from "@/lib/achievements"
import { updateStreak } from "@/lib/analytics"
import { recordActivity } from "@/lib/contribution"
import { toDateKey } from "@/lib/dates"
import { createDefaultUserData } from "@/lib/defaults"
import { loadUserData, saveUserData } from "@/lib/storage"
import { levelFromXp } from "@/lib/xp"
import { useAuth } from "@/components/providers/auth-provider"
import type {
  Goal,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  Habit,
  PomodoroSession,
  UserData,
  UserPreferences,
  UserProfile,
} from "@/lib/types"

interface AppContextValue extends UserData {
  hydrated: boolean
  quickAddOpen: boolean
  setQuickAddOpen: (open: boolean) => void
  addGoal: (goal: Omit<Goal, "id" | "status" | "createdAt"> & { status?: GoalStatus }) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  updateGoalStatus: (id: string, status: GoalStatus) => void
  removeGoal: (id: string) => void
  toggleHabitToday: (id: string) => void
  isHabitDoneToday: (id: string) => boolean
  addHabit: (habit: Omit<Habit, "id">) => void
  removeHabit: (id: string) => void
  completePomodoro: (session: Omit<PomodoroSession, "id" | "completedAt">) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  resetUserData: () => void
  /** @deprecated use goals */
  tasks: Goal[]
  addTask: AppContextValue["addGoal"]
  updateTaskStatus: AppContextValue["updateGoalStatus"]
  removeTask: AppContextValue["removeGoal"]
}

const AppContext = createContext<AppContextValue | null>(null)

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function processRewards(data: UserData, activityAmount = 1): UserData {
  let next = recordActivity(data, activityAmount)
  next = updateStreak(next)
  const unlocked = getNewlyUnlockedAchievements(next)
  next = applyAchievementUnlocks(next, unlocked)
  next.level = levelFromXp(next.xp)
  return next
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth()
  const [state, setState] = useState<UserData>(createDefaultUserData("", ""))
  const [hydrated, setHydrated] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  useEffect(() => {
    if (!userId) {
      setHydrated(false)
      return
    }

    let cancelled = false

    async function load() {
      const existing = await loadUserData(userId)
      const loaded = existing ?? createDefaultUserData("", "")
      if (cancelled) return

      setState(loaded)
      setHydrated(true)
      document.documentElement.classList.toggle("dark", loaded.preferences.darkMode)
      document.documentElement.classList.toggle("light", !loaded.preferences.darkMode)

      if (!existing) await saveUserData(userId, loaded)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (hydrated && userId) void saveUserData(userId, state)
  }, [state, hydrated, userId])

  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "status" | "createdAt"> & { status?: GoalStatus }) => {
      setState((prev) =>
        processRewards(
          {
            ...prev,
            goals: [
              ...prev.goals,
              {
                ...goal,
                id: createId(),
                status: goal.status ?? "todo",
                createdAt: new Date().toISOString(),
              },
            ],
          },
          0
        )
      )
    },
    []
  )

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  }, [])

  const updateGoalStatus = useCallback((id: string, status: GoalStatus) => {
    setState((prev) => {
      const goal = prev.goals.find((g) => g.id === id)
      if (!goal) return prev

      const wasDone = goal.status === "done"
      const isDone = status === "done"
      let next: UserData = {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === id
            ? {
                ...g,
                status,
                completedAt: isDone ? new Date().toISOString() : undefined,
                progress: isDone ? 100 : g.progress,
              }
            : g
        ),
      }

      if (!wasDone && isDone) {
        next = { ...next, xp: next.xp + goal.xp }
        next = processRewards(next, 2)
      } else if (wasDone && !isDone) {
        next = { ...next, xp: Math.max(0, next.xp - goal.xp) }
        next.level = levelFromXp(next.xp)
      }

      return next
    })
  }, [])

  const removeGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }))
  }, [])

  const toggleHabitToday = useCallback((habitId: string) => {
    const today = toDateKey()
    setState((prev) => {
      const done = prev.habitCompletions[today] ?? []
      const isDone = done.includes(habitId)
      const nextDone = isDone
        ? done.filter((id) => id !== habitId)
        : [...done, habitId]

      let next: UserData = {
        ...prev,
        habitCompletions: { ...prev.habitCompletions, [today]: nextDone },
      }

      if (!isDone) {
        next = { ...next, xp: next.xp + 15 }
        next = processRewards(next, 1)
      }

      return next
    })
  }, [])

  const isHabitDoneToday = useCallback(
    (habitId: string) => {
      const today = toDateKey()
      return (state.habitCompletions[today] ?? []).includes(habitId)
    },
    [state.habitCompletions]
  )

  const addHabit = useCallback((habit: Omit<Habit, "id">) => {
    setState((prev) => ({
      ...prev,
      habits: [...prev.habits, { ...habit, id: createId() }],
    }))
  }, [])

  const removeHabit = useCallback((id: string) => {
    setState((prev) => {
      const habitCompletions = Object.fromEntries(
        Object.entries(prev.habitCompletions).map(([date, ids]) => [
          date,
          ids.filter((habitId) => habitId !== id),
        ])
      )
      return {
        ...prev,
        habits: prev.habits.filter((h) => h.id !== id),
        habitCompletions,
      }
    })
  }, [])

  const completePomodoro = useCallback(
    (session: Omit<PomodoroSession, "id" | "completedAt">) => {
      setState((prev) => {
        const xpGain = session.phase === "focus" ? 25 : 5
        let next: UserData = {
          ...prev,
          pomodoroSessions: [
            ...prev.pomodoroSessions,
            {
              ...session,
              id: createId(),
              completedAt: new Date().toISOString(),
            },
          ],
          xp: prev.xp + xpGain,
        }
        next = processRewards(next, session.phase === "focus" ? 2 : 1)
        return next
      })
    },
    []
  )

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }))
  }, [])

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState((prev) => {
      const next = {
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
      }
      if (preferences.darkMode !== undefined) {
        document.documentElement.classList.toggle("dark", preferences.darkMode)
        document.documentElement.classList.toggle("light", !preferences.darkMode)
      }
      return next
    })
  }, [])

  const resetUserData = useCallback(() => {
    if (!userId) return
    const fresh = createDefaultUserData(state.profile.displayName, state.profile.email)
    setState(fresh)
    void saveUserData(userId, fresh)
  }, [userId, state.profile.displayName, state.profile.email])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      hydrated,
      quickAddOpen,
      setQuickAddOpen,
      addGoal,
      updateGoal,
      updateGoalStatus,
      removeGoal,
      toggleHabitToday,
      isHabitDoneToday,
      addHabit,
      removeHabit,
      completePomodoro,
      updateProfile,
      updatePreferences,
      resetUserData,
      tasks: state.goals,
      addTask: addGoal,
      updateTaskStatus: updateGoalStatus,
      removeTask: removeGoal,
    }),
    [
      state,
      hydrated,
      quickAddOpen,
      addGoal,
      updateGoal,
      updateGoalStatus,
      removeGoal,
      toggleHabitToday,
      isHabitDoneToday,
      addHabit,
      removeHabit,
      completePomodoro,
      updateProfile,
      updatePreferences,
      resetUserData,
    ]
  )

  if (!userId) return null

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function useGoalsByStatus(status: GoalStatus) {
  const { goals } = useApp()
  return useMemo(() => goals.filter((g) => g.status === status), [goals, status])
}

export { type GoalCategory, type GoalPriority, type GoalStatus }
