import { DashboardLayoutWrapper } from './_layout/components/dashboard-layout-wrapper'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
}
