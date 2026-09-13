import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { ContributionGraph } from "@/components/contribution-graph"
import { DashboardStats } from "@/components/dashboard-stats"
import { TrophyCase } from "@/components/trophy-case"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <div className="mb-6">
          <ContributionGraph />
        </div>
        <DashboardStats />
        <div className="mt-6">
          <TrophyCase />
        </div>
      </PageContent>
    </DashboardLayout>
  )
}
