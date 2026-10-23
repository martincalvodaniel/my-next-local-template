import "server-only"

import {
  accessEmailSchema,
  submitAccessRequestSchema,
} from "@/schemas/user-access"
import type { AccessActionState, AccessRole } from "@/types/access"

interface RequestAccessDependencies {
  getVerifiedEmail: () => Promise<string | null>
  getRole: (email: string) => Promise<AccessRole | null>
  submit: (email: string) => Promise<void>
}

export async function requestAccess(
  input: unknown,
  dependencies: RequestAccessDependencies
): Promise<AccessActionState> {
  try {
    const email = accessEmailSchema.safeParse(
      await dependencies.getVerifiedEmail()
    )
    if (!email.success)
      return {
        status: "error",
        message:
          "Inicia sesión con una cuenta de Google verificada para solicitar acceso.",
      }
    if (!submitAccessRequestSchema.safeParse(input).success)
      return { status: "error", message: "La solicitud no es válida." }
    if (await dependencies.getRole(email.data))
      return {
        status: "error",
        message: "Tu cuenta ya tiene acceso. Vuelve al inicio.",
      }
    await dependencies.submit(email.data)
    return {
      status: "success",
      message: "Solicitud enviada. Un administrador debe revisarla.",
    }
  } catch {
    return {
      status: "error",
      message: "No se ha podido enviar la solicitud. Inténtalo de nuevo.",
    }
  }
}
