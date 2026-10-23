import type { ReactNode } from "react"
import { AppNavigation } from "@/components/shared/app-navigation"

export function AppShell({
  children,
  name,
  email,
}: {
  children: ReactNode
  name: string
  email: string
}) {
  return (
    <>
      <AppNavigation name={name} email={email} />
      <div className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
    </>
  )
}
