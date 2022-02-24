import {config} from 'dotenv'
config()

export default {
  port: process.env.PORT || 4000,
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  session_secret: process.env.SESSION_SECRET
}