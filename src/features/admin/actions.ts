"use server"

import { revalidatePath } from "next/cache"
import { manageUserAccess } from "@/features/admin/manage-access"
import { isAdminEmail } from "@/lib/auth/access"
import { getAuthorizedSession } from "@/lib/auth/session"
import { grantUserAccess, revokeUserAccess } from "@/lib/db/user-access"
import type { AccessActionState } from "@/types/access"

export async function changeUserAccess(
  _previousState: AccessActionState,
  formData: FormData
): Promise<AccessActionState> {
  const result = await manageUserAccess(
    { email: formData.get("email"), operation: formData.get("operation") },
    {
      getActorRole: async () => (await getAuthorizedSession())?.role ?? null,
      isAdminEmail,
      grant: grantUserAccess,
      revoke: revokeUserAccess,
    }
  )
  if (result.status === "success") revalidatePath("/admin")
  return result
}
