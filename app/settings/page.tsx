import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Header />
      <PageContent narrow>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Profile, pomodoro, and preferences (saved locally)
          </p>
        </div>
        <SettingsForm />
      </PageContent>
    </DashboardLayout>
  )
}
