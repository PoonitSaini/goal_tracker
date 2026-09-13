import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { PomodoroHistory } from "@/components/pomodoro-history"

export default function FocusPage() {
  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Focus</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Pomodoro timer with session history and XP rewards
          </p>
        </div>
        <div className="mb-8 w-full max-w-lg">
          <PomodoroTimer />
        </div>
        <PomodoroHistory />
      </PageContent>
    </DashboardLayout>
  )
}
