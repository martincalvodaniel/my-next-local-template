# Authentication Rules

- `auth.ts` and `session.ts` are server-only. `auth-client.ts` is client-only. Pure helpers must remain usable in isolated tests without importing server configuration.
- The current Better Auth configuration has no database adapter: do not assume users, accounts, or sessions are persisted in MongoDB. Cookie cache and OAuth state settings are deliberate; changing them requires a documented security decision.
- Preserve the deny-by-default allowlist. `getAuthorizedSession()` validates both session and allowed email; `requireAuthorizedSession()` adds a page redirect.
- For API handlers and Server Actions, return an appropriate unauthorized result and authorize resource ownership before accessing data. Do not rely solely on a layout or cookie presence in the proxy.
- Keep post-login redirects internal through `getSafeCallbackUrl()`. Cover any change to accepted redirect formats with meaningful regression tests.
- Better Auth's catch-all route delegates protocol input validation to the library. Validate new application-owned contracts with shared Zod schemas.
- Read configuration through `src/config/env.ts`. Never log cookies, tokens, OAuth credentials, or actual allowed email addresses.
- Unit tests do not establish that a real Google OAuth flow works. Record manual or integration evidence separately when that flow changes.
