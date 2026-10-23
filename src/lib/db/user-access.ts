import "server-only"

import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections"
import { accessEmailSchema } from "@/schemas/user-access"
import type { UserAccessPage } from "@/types/access"

interface UserAccessDocument {
  email: string
  createdAt: Date
}

const PAGE_SIZE = 50

async function getUserAccessCollection() {
  return getCollection<UserAccessDocument>(COLLECTION_NAMES.userAccess)
}

export async function hasUserAccess(email: string): Promise<boolean> {
  const collection = await getUserAccessCollection()
  const entry = await collection.findOne(
    { email: accessEmailSchema.parse(email) },
    { projection: { _id: 1 } }
  )
  return entry !== null
}

export async function grantUserAccess(email: string): Promise<void> {
  const collection = await getUserAccessCollection()
  const normalizedEmail = accessEmailSchema.parse(email)
  try {
    await collection.updateOne(
      { email: normalizedEmail },
      { $setOnInsert: { email: normalizedEmail, createdAt: new Date() } },
      { upsert: true }
    )
  } catch (error: unknown) {
    // Concurrent grants for the same normalized email are idempotent.
    if (!(error instanceof Error && "code" in error && error.code === 11000)) {
      throw error
    }
  }
}

export async function revokeUserAccess(email: string): Promise<void> {
  const collection = await getUserAccessCollection()
  await collection.deleteOne({ email: accessEmailSchema.parse(email) })
}

export async function listUserAccess(after?: string): Promise<UserAccessPage> {
  const collection = await getUserAccessCollection()
  const filter = after ? { email: { $gt: accessEmailSchema.parse(after) } } : {}
  const documents = await collection
    .find(filter)
    .sort({ email: 1 })
    .limit(PAGE_SIZE + 1)
    .toArray()
  const entries = documents.slice(0, PAGE_SIZE).map((entry) => ({
    email: entry.email,
    createdAt: entry.createdAt.toISOString(),
  }))
  return {
    entries,
    nextCursor:
      documents.length > PAGE_SIZE ? entries[entries.length - 1].email : null,
  }
}
