import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { AnalyticsSummary } from "@/components/analytics-summary"
import { WeeklyXPChart } from "@/components/weekly-xp-chart"
import { SkillMatrix } from "@/components/skill-matrix"
import { TrophyCase } from "@/components/trophy-case"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Analytics</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Your personal productivity metrics and trends
          </p>
        </div>
        <AnalyticsSummary />
        <div className="mb-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_320px]">
          <WeeklyXPChart />
          <SkillMatrix />
        </div>
        <TrophyCase />
      </PageContent>
    </DashboardLayout>
  )
}
