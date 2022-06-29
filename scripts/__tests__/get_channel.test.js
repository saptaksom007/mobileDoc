import {
  getChannel,
  concatVersion,
  concatBuildNumber,
  isProduction,
  getChannelWithVersionAndBuildNumber
} from '../get_channel'

describe('get_channel', () => {
  it('should getChannel', () => {
    expect(getChannel('qa', 'develop')).toBe('qa')
  })
  it('should getChannel master', () => {
    expect(getChannel('', 'master')).toBe('production')
  })
  it('should getChannel demo1', () => {
    expect(getChannel('demo1', 'develop')).toBe('demo1')
  })
  it('should getChannel feature', () => {
    expect(getChannel('', 'feature/test')).toBe('feature_test')
  })
  it('should concatVersion', () => {
    expect(concatVersion('1.0.0', 'channel')).toBe('channel-v1.0.0')
  })
  it('should concatBuildNumber', () => {
    expect(concatBuildNumber('123', 'channel-v1.0.0')).toBe(
      'channel-v1.0.0-123'
    )
  })
  it('should test isProduction', () => {
    expect(isProduction('production')).toBe(true)
    expect(isProduction('qa')).toBe(false)
  })
  it('should getChannelWithVersionAndBuildNumber return default', () => {
    expect(getChannelWithVersionAndBuildNumber()).toBe('qa-v0.0.0-0')
  })
  it('should getChannelWithVersionAndBuildNumber production', () => {
    expect(
      getChannelWithVersionAndBuildNumber(
        undefined,
        undefined,
        'production',
        '123'
      )
    ).toBe('production')
  })
  it('should getChannelWithVersionAndBuildNumber qa', () => {
    expect(
      getChannelWithVersionAndBuildNumber('develop', '1.2.3', 'qa', '123')
    ).toBe('qa-v1.2.3-123')
  })
  it('should getChannelWithVersionAndBuildNumber stage', () => {
    expect(
      getChannelWithVersionAndBuildNumber(
        'release/v1.2.3',
        '1.2.3',
        'stage',
        '123'
      )
    ).toBe('stage')
  })
  it('should getChannelWithVersionAndBuildNumber demo1', () => {
    expect(
      getChannelWithVersionAndBuildNumber('develop', '1.2.3', 'demo1', '123')
    ).toBe('demo1')
  })
  it('should getChannelWithVersionAndBuildNumber demo2', () => {
    expect(
      getChannelWithVersionAndBuildNumber('develop', '1.2.3', 'demo2', '123')
    ).toBe('demo2-v1.2.3-123')
  })
  it('should getChannelWithVersionAndBuildNumber master', () => {
    expect(
      getChannelWithVersionAndBuildNumber('master', '1.2.3', 'it', '123')
    ).toBe('production')
  })
  it('should getChannelWithVersionAndBuildNumber feature', () => {
    expect(
      getChannelWithVersionAndBuildNumber('feature/test', '1.2.3', 'qa', '123')
    ).toBe('feature_test-v1.2.3-123')
  })
})
