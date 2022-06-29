

export const randomString = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5)

export const random = () => Math.round(Math.random() * 100000)
