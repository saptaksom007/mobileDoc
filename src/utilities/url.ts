

export default {}

export const isUrl = (url: string): boolean =>
  url.startsWith('http') && url.includes('://')
