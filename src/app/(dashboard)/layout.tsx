import { AppShell } from "@/components/shared/app-shell"
import { requireAuthorizedSession } from "@/lib/auth/session"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireAuthorizedSession()

  return (
    <AppShell name={session.user.name} email={session.user.email}>
      {children}
    </AppShell>
  )
}
