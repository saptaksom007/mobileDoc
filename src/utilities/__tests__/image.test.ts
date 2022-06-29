import ImageUtil, { calculateBetterSize } from '../image'

describe('image', () => {
  it('resize less', () => {
    expect(calculateBetterSize(1000, 1000)).toEqual({
      width: 1000,
      height: 1000
    })
  })
  it('resize width more', () => {
    expect(calculateBetterSize(1700, 1000)).toEqual({
      width: ImageUtil.MAX_IMG_SIZE
    })
  })
  it('resize height more', () => {
    expect(calculateBetterSize(1000, 1700)).toEqual({
      height: ImageUtil.MAX_IMG_SIZE
    })
  })
  it('resize both more (equal)', () => {
    expect(calculateBetterSize(1700, 1700)).toEqual({
      width: ImageUtil.MAX_IMG_SIZE
    })
  })
  it('resize both more', () => {
    expect(calculateBetterSize(1800, 1700)).toEqual({
      width: ImageUtil.MAX_IMG_SIZE
    })
  })
})
