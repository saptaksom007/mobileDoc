import * as React from 'react'
import { G, Line, Text } from 'react-native-svg'
import { Color } from 'constants/Color'
import { momentWithLocales } from 'utilities/date'

interface Props {
  width: number
  ticks: number
  x: number
  y: number
  scale(x: any): number
  vertical?: boolean
}
export default ({ width, ticks, x, y, vertical, scale }: Props) => {
  const getTickPoints = (
    vert: boolean,
    start: number,
    end: number,
    numTicks: number,
  ) => {
    const res = []
    const ticksEvery = Math.floor(width / (numTicks - 1))
    if (vert) {
      for (let cur = start; cur >= end; cur -= ticksEvery) {
        res.push(cur)
      }
    } else {
      for (let cur = start; cur <= end; cur += ticksEvery) {
        res.push(cur)
      }
    }
    return res
  }

  const TICKSIZE = width / 70
  x = x || 0
  y = y || 0
  const endX = vertical ? x : x + width
  const endY = vertical ? y - width : y

  const tickPoints = vertical
    ? getTickPoints(vertical, y, endY, ticks)
    : getTickPoints(vertical || false, x, endX, ticks)

  const label = React.useCallback(
    (pos: number) => {
      if (vertical) {
        return Math.round(scale(pos))
      }
      return momentWithLocales(scale(pos)).format('DD MMM')
    },
    [ticks],
  )

  return (
    <G fill='none'>
      <Line
        stroke={Color.tintColor}
        strokeWidth='1'
        x1={x}
        x2={endX}
        y1={y}
        y2={endY}
      />
      {tickPoints.map(pos => (
        <Line
          key={pos}
          stroke={Color.tintColor}
          strokeWidth='1'
          x1={vertical ? x! - TICKSIZE : pos}
          y1={vertical ? pos : y}
          x2={vertical ? 400 /* TODO: ? */ : pos}
          y2={vertical ? pos : y! + TICKSIZE}
        />
      ))}
      {tickPoints.map(pos => {
        const tickX = vertical ? x! - 2 * TICKSIZE : pos
        const tickY = vertical ? pos : y! + 2 * TICKSIZE
        return (
          <Text
            key={pos}
            fill={Color.blueDD}
            fontSize='9'
            fontWeight={'500'}
            fontFamily={'System'}
            textAnchor='middle'
            transform={vertical ? 'translate(-3 -3)' : `translate(0 3)`}
            x={tickX}
            y={tickY}
          >
            {label(pos)}
          </Text>
        )
      })}
    </G>
  )
}
