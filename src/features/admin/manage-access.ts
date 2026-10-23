import "server-only"

import { userAccessMutationSchema } from "@/schemas/user-access"
import type { AccessActionState, AccessRole } from "@/types/access"

interface AccessManagementDependencies {
  getActorRole: () => Promise<AccessRole | null>
  isAdminEmail: (email: string) => boolean
  grant: (email: string) => Promise<void>
  revoke: (email: string) => Promise<void>
}

export async function manageUserAccess(
  input: unknown,
  dependencies: AccessManagementDependencies
): Promise<AccessActionState> {
  try {
    if ((await dependencies.getActorRole()) !== "admin") {
      return {
        status: "error",
        message: "No tienes permisos de administración.",
      }
    }
    const parsed = userAccessMutationSchema.safeParse(input)
    if (!parsed.success) {
      return {
        status: "error",
        message: "Introduce un correo válido y una operación permitida.",
      }
    }
    const { email, operation } = parsed.data
    if (dependencies.isAdminEmail(email)) {
      return {
        status: "error",
        message:
          "Los administradores se gestionan mediante ALLOWED_EMAILS, no desde esta lista.",
      }
    }
    if (operation === "grant") await dependencies.grant(email)
    else await dependencies.revoke(email)
    return {
      status: "success",
      message:
        operation === "grant"
          ? "Acceso de usuario concedido."
          : "Acceso de usuario revocado.",
    }
  } catch {
    return {
      status: "error",
      message: "No se ha podido guardar el cambio. Inténtalo de nuevo.",
    }
  }
}
