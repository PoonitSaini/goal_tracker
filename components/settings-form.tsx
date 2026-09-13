"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Keyboard, Timer } from "lucide-react"
import { useApp } from "@/components/providers/app-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useTheme } from "next-themes"
import { toast } from "sonner"

const preferenceItems = [
  { key: "pushNotifications" as const, icon: Bell, label: "Notifications", description: "Reminders for streaks and achievements" },
  { key: "darkMode" as const, icon: Moon, label: "Dark Mode", description: "Use dark theme" },
  { key: "keyboardShortcuts" as const, icon: Keyboard, label: "Keyboard Shortcuts", description: "Enable keyboard navigation" },
]

export function SettingsForm() {
  const router = useRouter()
  const { profile, preferences, updateProfile, updatePreferences, resetUserData } = useApp()
  const { logout } = useAuth()
  const { setTheme } = useTheme()
  const [form, setForm] = useState(profile)
  const [prefs, setPrefs] = useState(preferences)
  const [focusMin, setFocusMin] = useState(String(preferences.focusMinutes))
  const [breakMin, setBreakMin] = useState(String(preferences.breakMinutes))

  useEffect(() => {
    setForm(profile)
    setPrefs(preferences)
    setFocusMin(String(preferences.focusMinutes))
    setBreakMin(String(preferences.breakMinutes))
  }, [profile, preferences])

  const handleSave = () => {
    updateProfile(form)
    updatePreferences({
      ...prefs,
      focusMinutes: Math.max(5, Number.parseInt(focusMin, 10) || 25),
      breakMinutes: Math.max(1, Number.parseInt(breakMin, 10) || 5),
    })
    setTheme(prefs.darkMode ? "dark" : "light")
    toast.success("Settings saved")
  }

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <>
      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Profile</h2>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Timer className="h-5 w-5" />
          Pomodoro
        </h2>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="focus-min">Focus (minutes)</Label>
            <Input id="focus-min" type="number" min={5} value={focusMin} onChange={(e) => setFocusMin(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="break-min">Break (minutes)</Label>
            <Input id="break-min" type="number" min={1} value={breakMin} onChange={(e) => setBreakMin(e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Preferences</h2>
        <div className="space-y-4">
          {preferenceItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={(checked) => setPrefs({ ...prefs, [item.key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button className="w-full bg-primary text-primary-foreground sm:w-auto" onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => { setForm(profile); setPrefs(preferences) }}>
          Cancel
        </Button>
        <Button variant="outline" onClick={resetUserData}>
          Reset My Data
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  )
}
