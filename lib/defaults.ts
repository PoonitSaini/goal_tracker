import type { Goal, Habit, UserData } from "./types"

export const defaultGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Implement Red-Black Tree Balancing",
    description: "Complete insertion and deletion logic for the memory allocator.",
    category: "DSA",
    priority: "critical",
    xp: 120,
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "goal-2",
    title: "Refactor Next.js Middleware",
    category: "WEB DEV",
    priority: "low",
    xp: 50,
    status: "todo",
    dueDate: "Jul 24",
    createdAt: new Date().toISOString(),
  },
  {
    id: "goal-3",
    title: "Train Llama-3 Fine-tuning Model",
    category: "AI/ML",
    priority: "high",
    xp: 200,
    status: "in-progress",
    progress: 65,
    createdAt: new Date().toISOString(),
  },
]

export const defaultHabits: Habit[] = [
  { id: "h-1", name: "LeetCode Daily", duration: "15 mins", category: "Logic", shortCode: "LC" },
  { id: "h-2", name: "PR Review", duration: "2 reviews", category: "Quality", shortCode: "PR" },
  { id: "h-3", name: "Morning Documentation", duration: "10 mins", category: "Knowledge", shortCode: "DOC" },
]

export function createDefaultUserData(username: string, email: string): UserData {
  return {
    profile: {
      displayName: username,
      email,
      bio: "Personal productivity tracker",
    },
    preferences: {
      pushNotifications: true,
      darkMode: true,
      keyboardShortcuts: true,
      focusMinutes: 25,
      breakMinutes: 5,
    },
    goals: defaultGoals,
    habits: defaultHabits,
    streak: 0,
    longestStreak: 0,
    xp: 0,
    level: 1,
    lastActiveDate: null,
    dailyActivity: {},
    habitCompletions: {},
    pomodoroSessions: [],
    unlockedAchievements: [],
    createdAt: new Date().toISOString(),
  }
}
