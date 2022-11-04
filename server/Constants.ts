import { resolve } from 'path'
import dotenv from 'dotenv'

export const ServerRootPath = resolve(__dirname)
export const ProjectRootPath = resolve(__dirname, '..')

dotenv.config({ path: resolve(ProjectRootPath, '.env') })

const PORT = parseInt(process.env.PORT ?? '4000', 10) - 1
const RedirectHost = process.env.REDIRECT_HOST ?? 'nil'
const JWTSecret = process.env.JWT_SECRET ?? 'nil'
const UseInvites = process.env.USE_INVITES === 'true'

if (RedirectHost === 'nil') throw new Error('No redirect host env variable. Please add one in .env!')
if (JWTSecret === 'nil') throw new Error('No redirect host env variable. Please add one in .env!')

export {
  PORT,
  RedirectHost,
  JWTSecret,
  UseInvites,
}
