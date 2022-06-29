import ApiEnvUrl from 'config/api.json'
import { isProduction, isStage, getTestId } from '../environment'

import { getEnvFromChannel } from '../channels'

describe('env', () => {
  it('test if production', () => {
    expect(isProduction('stage')).toBe(false)
    expect(isProduction('qa')).toBe(false)
    expect(isProduction('dev')).toBe(false)
  })
  it('test if stage', () => {
    expect(isStage('production')).toBe(false)
    expect(isStage('realida')).toBe(false)
    expect(isStage('stage')).toBe(false)
    expect(isStage('qa')).toBe(false)
    expect(isStage('dev')).toBe(false)
  })
  it('test id', () => {
    expect(getTestId('testId')).toBe('testId')
  })
  it('getEnvFromChannel', () => {
    expect(getEnvFromChannel()).toBe('qa')
  })
  it('ApiEnvUrl', () => {
    expect(ApiEnvUrl).toBeDefined()
  })
})
