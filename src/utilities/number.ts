export default {}

export const isInteger = (x: any) => {
  if (x === null) {
    return false
  }
  if (typeof x === 'string' && x.trim() === '') {
    return false
  }
  return Number.isInteger(Number(x))
}

export const convertMinutesToJAVADuration = (minutes: any) => {
  return `PT${parseFloat(minutes) * 60}S`
}

export const convertJAVADurationToMinutes = (duration: any) => {
  if (!duration) {
    return ''
  }
  let numberValue = String(duration).replace('PT', '')
  numberValue = numberValue.replace('M', '')
  return `${numberValue}`
}
