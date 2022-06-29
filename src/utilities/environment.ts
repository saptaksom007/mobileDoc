import { Env } from 'env'

const PROD_KEYS: string[] = ['production']
const STAGE_KEYS: string[] = ['stage', 'demo1', 'demo2']
const QA_KEYS: string[] = ['qa', 'it', 'default']

export const isProduction = (env: string = Env.environment) =>
  PROD_KEYS.includes(env)

export const isStage = (env: string = Env.environment) =>
  STAGE_KEYS.includes(env)

export const isQa = (env: string = Env.environment) => QA_KEYS.includes(env)

export const getTestId = (id: string) =>
  isProduction() || isStage() ? undefined : id
