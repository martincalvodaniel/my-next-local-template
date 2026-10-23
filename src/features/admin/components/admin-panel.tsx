import Link from "next/link"
import { AccessForm } from "@/features/admin/components/access-form"
import { PendingRequests } from "@/features/admin/components/pending-requests"
import type { AccessRequestPage, UserAccessPage } from "@/types/access"

interface AdminPanelProps {
  users: UserAccessPage
  hasCursor: boolean
  requests: AccessRequestPage
  hasRequestsCursor: boolean
}

export function AdminPanel({
  users,
  hasCursor,
  requests,
  hasRequestsCursor,
}: AdminPanelProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <Link
        href="/"
        className="w-fit rounded text-sm underline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Volver al inicio
      </Link>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Administración del sitio
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Gestiona los correos que pueden entrar como usuarios normales. Los
          administradores se definen en ALLOWED_EMAILS.
        </p>
      </header>
      <PendingRequests requests={requests} hasCursor={hasRequestsCursor} />
      <section
        aria-label="Conceder acceso"
        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-4 text-lg font-semibold">Conceder acceso</h2>
        <AccessForm />
      </section>
      <section aria-label="Usuarios autorizados" className="min-w-0">
        <h2 className="mb-3 text-lg font-semibold">Usuarios autorizados</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Revocar el acceso impide continuar en el siguiente acceso al servidor,
          incluso con una sesión abierta.
        </p>
        {users.entries.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            {hasCursor
              ? "No hay más usuarios en esta página."
              : "Todavía no hay usuarios normales autorizados."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {users.entries.map((entry) => (
              <li
                key={entry.email}
                className="grid min-w-0 gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="break-all text-sm font-medium">{entry.email}</p>
                <AccessForm email={entry.email} />
              </li>
            ))}
          </ul>
        )}
        <nav
          aria-label="Páginas de usuarios"
          className="mt-4 flex flex-wrap gap-4"
        >
          {hasCursor ? (
            <Link
              href="/admin"
              className="min-h-11 rounded px-2 py-3 text-sm underline focus-visible:outline-2"
            >
              Primera página
            </Link>
          ) : null}
          {users.nextCursor ? (
            <Link
              href={`/admin?after=${encodeURIComponent(users.nextCursor)}`}
              className="min-h-11 rounded px-2 py-3 text-sm underline focus-visible:outline-2"
            >
              Siguiente página
            </Link>
          ) : null}
        </nav>
      </section>
    </main>
  )
}
