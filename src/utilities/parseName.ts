import { split, pipe, lt, ifElse } from 'ramda'

interface ParsedNamed {
  salutation: string | undefined
  firstName: string | undefined
  lastName: string | undefined
}

const strLength = (s: string[]) => s.length

export const hasSalutation = pipe(
  strLength,
  lt(2)
)

export const transformNameArray = (names: string[]): ParsedNamed =>
  ifElse(
    hasSalutation,
    nTrue => ({
      salutation: nTrue[0],
      firstName: nTrue[1],
      lastName: nTrue[2]
    }),
    nFalse => ({
      salutation: undefined,
      firstName: nFalse[0],
      lastName: nFalse[1]
    })
  )(names)

export const parseName = (name: string): ParsedNamed =>
  pipe(
    split(' '),
    transformNameArray
  )(name)
