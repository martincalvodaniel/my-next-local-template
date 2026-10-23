import { z } from "zod"

export const accessEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email().max(254))

export const userAccessMutationSchema = z
  .object({
    email: accessEmailSchema,
    operation: z.enum(["grant", "revoke"]),
  })
  .strict()

export const userAccessQuerySchema = z
  .object({
    after: accessEmailSchema.optional(),
  })
  .strict()
