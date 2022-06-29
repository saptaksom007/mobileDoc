import axios from 'axios'
import { hasMinVersion } from 'utilities/version'
import { pathOr } from 'ramda'
import { Env } from 'env'

export function doesVersionMatch(state: any) {
  const minVersion = pathOr(
    Env.version,
    ['supportedVersion', 'minVersion'],
    state,
  )

  return hasMinVersion(minVersion, Env.version)
}

export async function showMaintenanceAsync(): Promise<boolean> {
  try {
    await axios.get(Env.maintenance, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    return true
  } catch (e) {
    return false
  }
}

export async function getVersionAsync(): Promise<object | undefined> {
  try {
    const result = await axios.get(Env.supportedVersion, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return result.data
  } catch (e) {
    return undefined
  }
}
