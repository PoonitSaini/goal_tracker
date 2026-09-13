import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/header"
import { PageContent } from "@/components/page-content"
import { GoalsBoard, GoalsPageHeader } from "@/components/goals-board"

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <Header />
      <PageContent>
        <GoalsPageHeader />
        <GoalsBoard />
      </PageContent>
    </DashboardLayout>
  )
}
