import { z } from 'zod'
import type { GcsCharacter } from '@/types/gcs'

const GcsVersionSchema = z.object({
  version: z.literal(5),
}).passthrough()

export function parseGcsFile(raw: unknown): GcsCharacter {
  const parsed = GcsVersionSchema.parse(raw)
  return parsed as GcsCharacter
}

export function parseGcsJson(jsonString: string): GcsCharacter {
  const raw = JSON.parse(jsonString)
  return parseGcsFile(raw)
}
