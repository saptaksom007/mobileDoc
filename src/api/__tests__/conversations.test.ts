import * as conversations from '../conversations'

describe('API conversations', () => {
  it('transformPostedAt number', async () => {
    const postedAtNumber = conversations.transformPostedAt({
      postedAt: 1501140052.432
    })
    expect(postedAtNumber).toBeDefined()
    expect(postedAtNumber).toBeInstanceOf(Object)
    expect(postedAtNumber.postedAt).toBe(1501140052432)
  })
  it('transformPostedAt string', async () => {
    const postedAtNumber = conversations.transformPostedAt({
      postedAt: '2017-07-27T08:59:30+02:00'
    })
    expect(postedAtNumber).toBeDefined()
    expect(postedAtNumber).toBeInstanceOf(Object)
    expect(postedAtNumber.postedAt).toBe('2017-07-27T08:59:30+02:00')
  })
})
