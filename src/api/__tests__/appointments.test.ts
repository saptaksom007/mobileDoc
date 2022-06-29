import * as appointments from '../appointments'

describe('API appointments', () => {
  it('isInTheFurture', async () => {
    expect(appointments.isInTheFurture(2995938527804)).toBeTruthy()
    expect(appointments.isInTheFurture(1497969263902)).toBeFalsy()
    expect(appointments.isInTheFurture('3017-06-20T14:38:43.150Z')).toBeTruthy()
    expect(appointments.isInTheFurture('2017-06-20T14:38:43.150Z')).toBeFalsy()
  })
  it('isMarkAsRead', async () => {
    expect(appointments.isMarkAsRead({ markAsRead: true })).toBe(true)
  })
  it('filterMarkAsRead', async () => {
    expect(appointments.filterMarkAsRead([{ markAsRead: true }])).toBeDefined()
    expect(
      appointments.filterMarkAsRead([
        { markAsRead: false, id: 1 },
        { markAsRead: true, id: 2 }
      ])
    ).toEqual([{ markAsRead: false, id: 1 }])
  })
  it('getMarkAsRead', async () => {
    expect(appointments.getMarkAsRead([{ markAsRead: true }])).toBeDefined()
    expect(
      appointments.getMarkAsRead([
        { markAsRead: false, id: 1 },
        { markAsRead: true, id: 2 }
      ])
    ).toEqual([{ markAsRead: true, id: 2 }])
  })
})
