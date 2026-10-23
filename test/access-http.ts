import assert from "node:assert/strict"
import { makeSignature, signJWT } from "better-auth/crypto"
import { getAuthEnv, getDatabaseEnv } from "@/config/env"
import { closeDatabaseConnection } from "@/lib/db/client"
import { hasUserAccess, revokeUserAccess } from "@/lib/db/user-access"

const configuration = getAuthEnv()
const database = getDatabaseEnv()
const origin = configuration.baseUrl
if (
  !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
  !/^template_access_test_[a-z0-9_]+$/.test(database.databaseName) ||
  !/^mongodb:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(database.uri) ||
  configuration.allowedEmails !== "admin@example.com"
) {
  throw new Error(
    "HTTP access checks require an isolated loopback application and fixture administrator"
  )
}

async function createCookie(email: string, emailVerified = true) {
  const now = new Date().toISOString()
  const token = crypto.randomUUID()
  const id = crypto.randomUUID()
  const jwt = await signJWT(
    {
      session: {
        id: crypto.randomUUID(),
        token,
        userId: id,
        createdAt: now,
        updatedAt: now,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
      user: {
        id,
        name: "Fixture",
        email,
        emailVerified,
        createdAt: now,
        updatedAt: now,
      },
      updatedAt: Date.now(),
      version: "1",
    },
    configuration.secret,
    3600
  )
  return `better-auth.session_token=${encodeURIComponent(`${token}.${await makeSignature(token, configuration.secret)}`)}; better-auth.session_data=${jwt}`
}

async function request(path: string, cookie?: string, body?: FormData) {
  return fetch(`${origin}${path}`, {
    redirect: "manual",
    method: body ? "POST" : "GET",
    headers: { ...(cookie ? { cookie } : {}), origin },
    body,
  })
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&")
}

function actionForm(html: string, email: string, operation: string) {
  const form = html.match(/<form[\s\S]*?<\/form>/)?.[0]
  assert.ok(form, "Rendered admin grant form is required")
  const data = new FormData()
  for (const input of form.matchAll(/<input[^>]*>/g)) {
    const name = input[0].match(/name="([^"]+)"/)?.[1]
    const value = input[0].match(/value="([^"]*)"/)?.[1] ?? ""
    if (name?.startsWith("$ACTION"))
      data.append(decodeHtml(name), decodeHtml(value))
  }
  assert.ok(
    [...data.keys()].length > 0,
    "Rendered Server Action metadata is required"
  )
  data.set("email", email)
  data.set("operation", operation)
  return data
}

try {
  const admin = await createCookie("admin@example.com")
  const user = await createCookie("normal@example.com")
  const unverifiedAdmin = await createCookie("admin@example.com", false)
  await revokeUserAccess("normal@example.com")
  assert.equal((await request("/admin")).status, 307)
  const adminResponse = await request("/admin", admin)
  assert.equal(adminResponse.status, 200)
  const adminHtml = await adminResponse.text()
  assert.ok(adminHtml.includes("Administración del sitio"))
  assert.ok(
    (await request("/admin", unverifiedAdmin)).headers
      .get("location")
      ?.includes("/auth/signin")
  )
  assert.ok(
    (await request("/", user)).headers.get("location")?.includes("/auth/signin")
  )
  await request(
    "/admin",
    admin,
    actionForm(adminHtml, " NORMAL@example.com ", "grant")
  )
  assert.equal(await hasUserAccess("normal@example.com"), true)
  const home = await request("/", user)
  assert.equal(home.status, 200)
  const homeHtml = await home.text()
  assert.ok(homeHtml.includes("usuario"))
  assert.ok(!homeHtml.includes('href="/admin"'))
  assert.equal((await request("/admin", user)).headers.get("location"), "/")
  await request(
    "/admin",
    user,
    actionForm(adminHtml, "attacker@example.com", "grant")
  )
  assert.equal(await hasUserAccess("attacker@example.com"), false)
  await request(
    "/admin",
    admin,
    actionForm(adminHtml, "admin@example.com", "revoke")
  )
  assert.equal((await request("/admin", admin)).status, 200)
  await request(
    "/admin",
    admin,
    actionForm(adminHtml, "normal@example.com", "revoke")
  )
  assert.equal(await hasUserAccess("normal@example.com"), false)
  assert.ok(
    (await request("/", user)).headers.get("location")?.includes("/auth/signin")
  )
  assert.ok(
    (await request("/admin", user)).headers
      .get("location")
      ?.includes("/auth/signin")
  )
  console.log(
    "Compiled Next access checks: PASS (admin/user/anonymous/unverified routes, real Server Action grants/revocations, denied privilege escalation, existing-cookie revocation)"
  )
} finally {
  await closeDatabaseConnection()
}
