import pg from 'pg'
import { config } from '../config/env.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: config.DB_URL,
})
