import { transformNameArray, hasSalutation, parseName } from '../parseName'

it('should detect if has salutaion in names array', () => {
  const hasOne = hasSalutation(['Dr', 'Alexander', 'Flemming'])
  expect(hasOne).toBe(true)
})

it('should transform array name to object', () => {
  const transformed = transformNameArray(['Dr', 'Alexander', 'Flemming'])
  expect(transformed).toEqual({
    salutation: 'Dr',
    firstName: 'Alexander',
    lastName: 'Flemming'
  })
})

it('should parse name with salutation', () => {
  const parsedName = parseName('Dr Alexander Flemming')
  expect(parsedName).toBeDefined()
  expect(parsedName).toEqual({
    salutation: 'Dr',
    firstName: 'Alexander',
    lastName: 'Flemming'
  })
})
