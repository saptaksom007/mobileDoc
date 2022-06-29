import {
  DEFAULT_CONTENT_TYPE,
  axiosStandard,
  runRequestAsync,
  runAuthRequestAsync,
  errorProneAxios
} from '../axios'

describe('AxiosUtils', () => {
  it('DEFAULT_CONTENT_TYPE', () => {
    expect(DEFAULT_CONTENT_TYPE).toBeDefined()
    expect(DEFAULT_CONTENT_TYPE).toContain('; ')
    expect(DEFAULT_CONTENT_TYPE).toBe('application/json; charset=utf-8')
  })
  it('axiosStandard', () => {
    expect(axiosStandard).toBeDefined()
  })
  it('runRequestAsync', () => {
    expect(runRequestAsync).toBeDefined()
  })
  it('runAuthRequestAsync', () => {
    expect(runAuthRequestAsync).toBeDefined()
  })
  it('errorProneAxios', () => {
    expect(errorProneAxios).toBeDefined()
  })
})
