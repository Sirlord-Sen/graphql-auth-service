import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables, { ParsedVariables } from 'dotenv-parse-variables'
 
const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true
})

export const parsedEnv: ParsedVariables = dotenvParseVariables(env)

export { default as DBConfig } from './db.config'