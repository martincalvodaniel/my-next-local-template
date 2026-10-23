interface AccountAvatarProps {
  name: string
  email: string
}

export function AccountAvatar({ name, email }: AccountAvatarProps) {
  const initials = (name.trim() || email)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
    >
      {initials}
    </span>
  )
}
