import { ErrorBanner } from "@/components/ui/error-banner"
import { AdminPanel } from "@/features/admin/components/admin-panel"
import { requireAdminSession } from "@/lib/auth/session"
import { listUserAccess } from "@/lib/db/user-access"
import { userAccessQuerySchema } from "@/schemas/user-access"

interface AdminScreenProps {
  query: { after?: string | string[] }
}

export async function AdminScreen({ query }: AdminScreenProps) {
  await requireAdminSession()
  const parsed = userAccessQuerySchema.safeParse(query)
  if (!parsed.success) {
    return (
      <ErrorBanner>La página de usuarios solicitada no es válida.</ErrorBanner>
    )
  }
  try {
    const users = await listUserAccess(parsed.data.after)
    return (
      <AdminPanel users={users} hasCursor={parsed.data.after !== undefined} />
    )
  } catch {
    return (
      <ErrorBanner>
        No se ha podido cargar la lista de usuarios. Vuelve a intentarlo.
      </ErrorBanner>
    )
  }
}
