import "server-only"

import { resolveAccessRequestSchema } from "@/schemas/user-access"
import type { AccessActionState, AccessRole } from "@/types/access"

interface ReviewRequestDependencies {
  getActorRole: () => Promise<AccessRole | null>
  isAdminEmail: (email: string) => boolean
  resolve: (
    email: string,
    requestId: string,
    decision: "approve" | "reject"
  ) => Promise<boolean>
}

export async function reviewAccessRequest(
  input: unknown,
  dependencies: ReviewRequestDependencies
): Promise<AccessActionState> {
  try {
    if ((await dependencies.getActorRole()) !== "admin")
      return {
        status: "error",
        message: "No tienes permisos de administración.",
      }
    const parsed = resolveAccessRequestSchema.safeParse(input)
    if (!parsed.success)
      return {
        status: "error",
        message: "La decisión no es válida. Actualiza la lista.",
      }
    const { email, requestId, decision } = parsed.data
    if (dependencies.isAdminEmail(email))
      return {
        status: "error",
        message: "Los administradores se gestionan mediante ALLOWED_EMAILS.",
      }
    if (!(await dependencies.resolve(email, requestId, decision)))
      return {
        status: "error",
        message:
          "La solicitud ya ha cambiado. Actualiza la lista antes de revisarla.",
      }
    return {
      status: "success",
      message:
        decision === "approve"
          ? "Solicitud aceptada. Acceso de usuario concedido."
          : "Solicitud rechazada.",
    }
  } catch {
    return {
      status: "error",
      message: "No se ha podido revisar la solicitud. Inténtalo de nuevo.",
    }
  }
}
