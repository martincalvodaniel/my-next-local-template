import "server-only"

import assert from "node:assert/strict"
import { getDatabaseEnv } from "@/config/env"
import { closeDatabaseConnection, getDatabase } from "@/lib/db/client"
import {
  grantUserAccess,
  hasUserAccess,
  listUserAccess,
  revokeUserAccess,
} from "@/lib/db/user-access"

// Run explicitly with --no-env-file and a disposable loopback database.
const configuration = getDatabaseEnv()
if (
  !/^mongodb:\/\/(127\.0\.0\.1|localhost):\d+\/?$/.test(configuration.uri) ||
  !/^template_access_test_[a-z0-9_]+$/.test(configuration.databaseName)
) {
  throw new Error(
    "Access integration requires a disposable template_access_test_* database on loopback"
  )
}

try {
  assert.equal(await hasUserAccess("user@example.com"), false)
  await Promise.all(
    Array.from({ length: 8 }, () => grantUserAccess(" USER@example.com "))
  )
  assert.equal(await hasUserAccess("user@example.com"), true)
  assert.equal((await listUserAccess()).entries.length, 1)
  await closeDatabaseConnection()
  assert.equal(await hasUserAccess("user@example.com"), true)
  await revokeUserAccess(" User@example.com ")
  assert.equal(await hasUserAccess("user@example.com"), false)
  await revokeUserAccess("user@example.com")
  await Promise.all(
    Array.from({ length: 53 }, (_, index) =>
      grantUserAccess(`user${String(index).padStart(3, "0")}@example.com`)
    )
  )
  const first = await listUserAccess()
  assert.equal(first.entries.length, 50)
  assert.notEqual(first.nextCursor, null)
  const last = await listUserAccess(first.nextCursor ?? undefined)
  assert.equal(last.entries.length, 3)
  assert.equal(last.nextCursor, null)
  assert.equal(
    new Set([...first.entries, ...last.entries].map((entry) => entry.email))
      .size,
    53
  )
  const database = await getDatabase()
  const indexes = await database
    .collection("user_access")
    .listIndexes()
    .toArray()
  assert.equal(
    indexes.some(
      (index) => index.name === "email_unique" && index.unique === true
    ),
    true
  )
  console.log(
    "MongoDB access integration: PASS (concurrent grants, normalization, reconnect, revocation, pagination, unique index)"
  )
} finally {
  await closeDatabaseConnection()
}
