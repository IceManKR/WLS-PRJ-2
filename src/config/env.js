import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return Number(value)
    }
    return value
  }, z.number().int().positive()).default(3000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL must be provided'),
})

const envData = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || process.env.DB_URL,
}

const parsedEnv = envSchema.parse(envData)

export const config = {
  PORT: parsedEnv.PORT,
  DB_URL: parsedEnv.DATABASE_URL,
}