import striptags from 'striptags'
import { AllHtmlEntities } from 'html-entities'
import { pipe } from 'ramda'

export const addCariageReturnBeforeTag = (str: string): string =>
  str ? str.replace(/<[^/].*?>/g, '\n') : ''

export const removeLastCarriageReturn = (str: string): string =>
  str ? str.replace(/\n$/, '') : ''

export const cleanTextChat = pipe(
  addCariageReturnBeforeTag,
  removeLastCarriageReturn,
  striptags,
  AllHtmlEntities.decode,
)

export const decodeText = AllHtmlEntities.decode

export const striptagsText = pipe(addCariageReturnBeforeTag, striptags)
