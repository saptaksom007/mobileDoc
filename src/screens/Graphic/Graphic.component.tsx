import * as React from 'react'
import i18n from 'ex-react-native-i18n'
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TextProps,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
} from 'react-native-svg'
import { scaleTime, scaleLinear } from 'd3-scale'
import * as shape from 'd3-shape'
import Axis from './components/Axis'
import { Color } from 'constants/Color'
import { Small } from 'components/CustomText/CustomText.component'
import { RawData } from './RawData'
import { useCallbackOne } from 'use-memo-one'
import {
  calculateLineHeight,
  SMALL_SIZE,
} from 'components/CustomText/CustomText.styles'
import { momentWithLocales } from 'utilities/date'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const phi = 1.618
const height = (1 - 1 / phi) * windowHeight
const strokeWidth = 2
const legendHeightBase = (windowHeight - height) / 4
const graphPadding = 17

const ITEM_PADDING_VERTICAL = 10

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: windowWidth,
    height: windowHeight,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: ITEM_PADDING_VERTICAL,
    backgroundColor: 'white',
  },
  label: {
    color: Color.black,
  },
})

const Separator = () => (
  <View
    style={{
      width: '100%',
      backgroundColor: Color.tintColorTTT,
      height: 1,
    }}
  />
)
const Label = ({
  style,
  ...props
}: TextProps & { children: React.ReactNode }) => (
  <Small style={[styles.label, style]} {...props} />
)

const HeaderList = () => (
  <View style={styles.item}>
    <Label>{i18n.t('surveys.graphic.date')}</Label>
    <Label>{i18n.t('surveys.graphic.weight')}</Label>
  </View>
)

const Item = (date?: number, onPress?: (i: RawData) => void) => ({
  item,
}: {
  item: RawData
}) => {
  const selected = date === item.date
  const selectedColor = [selected ? { color: Color.white } : undefined]
  return (
    <TouchableWithoutFeedback onPress={() => onPress!(item)}>
      <View
        style={[
          styles.item,
          selected ? { backgroundColor: Color.blue } : undefined,
        ]}
      >
        <Label style={selectedColor}>
          {momentWithLocales(item.date).format('DD MMM')}
        </Label>
        <Label style={selectedColor}>{item.value} Kg</Label>
      </View>
    </TouchableWithoutFeedback>
  )
}

interface Props {
  data: RawData[]
}

const ITEM_HEIGHT = ITEM_PADDING_VERTICAL * 2 + calculateLineHeight(SMALL_SIZE)
export const Graphic = ({ data }: Props) => {
  const [point, setPoint] = React.useState<RawData | undefined>()
  const { scaleX, scaleY, xAxisScale, yAxisScale } = createScales(
    data,
    windowWidth,
    height,
    graphPadding,
  )
  const d = shape
    .line<RawData>()
    .x(p => scaleX(p.date))
    .y(p => scaleY(p.value))
    .curve(shape.curveLinear)(data) as string
  const keyExtractor = ({ date }: any) => `${date}`
  const flatListRef = React.useRef<FlatList<RawData>>()
  const selectDot = useCallbackOne(
    (item: RawData) => () => {
      if (flatListRef.current) {
        setPoint(item)
        flatListRef.current.scrollToIndex({
          index: data.findIndex((i: RawData) => i.date === item.date),
          animated: true,
        })
      }
    },
    [],
  )
  const itemLayout = useCallbackOne(
    (_data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [data],
  )
  return (
    <View style={styles.container}>
      <View
        style={{
          width: windowWidth,
          height,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <Svg
          height={height}
          width={windowWidth}
          viewBox={`0 0 ${windowWidth} ${height}`}
        >
          {data && data.length > 1 ? (
            <>
              <Defs>
                <LinearGradient
                  id='gradient'
                  x1='50%'
                  y1='0%'
                  x2='50%'
                  y2='100%'
                >
                  <Stop offset='0%' stopColor={Color.gradientBlue} />
                  <Stop offset='80%' stopColor={Color.gradientBlueL} />
                  <Stop offset='100%' stopColor={Color.gradientBlueLL} />
                </LinearGradient>
              </Defs>
              <Path
                d={`${d}L ${windowWidth} ${height} L 0 ${height}`}
                fill='url(#gradient)'
              />
            </>
          ) : null}

          <Axis
            width={windowWidth - 2 * graphPadding}
            x={graphPadding}
            y={height - graphPadding}
            ticks={8}
            scale={xAxisScale}
          />
          <Axis
            width={height - 2 * graphPadding}
            vertical
            x={graphPadding}
            y={height - graphPadding}
            ticks={8}
            scale={yAxisScale}
          />
          <Path
            fill='transparent'
            stroke={Color.tintColor}
            {...{ d, strokeWidth }}
          />
          {data.map(({ value, date }, i) => (
            <G key={`${date}-${i}`}>
              <Circle
                stroke={point?.date === date ? Color.tintColor : Color.white}
                strokeWidth={3}
                pointerEvents='none'
                cx={scaleX(date)}
                cy={scaleY(value)}
                r={5}
                fill={point?.date === date ? Color.white : Color.tintColor}
              />
              <Circle
                onPress={selectDot({ value, date })}
                cx={scaleX(date)}
                cy={scaleY(value)}
                r={12}
                fill={'rgba(0,0,0,0)'}
              />
            </G>
          ))}
        </Svg>
      </View>
      <View
        style={{
          width: windowWidth,
          paddingHorizontal: 40,
          paddingTop: 15,
          height: legendHeightBase * 3,
          backgroundColor: Color.white,
        }}
      >
        <FlatList
          ref={flatListRef as any}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={HeaderList}
          stickyHeaderIndices={[0]}
          getItemLayout={itemLayout}
          {...{ keyExtractor, data, renderItem: Item(point?.date, setPoint) }}
        />
      </View>
    </View>
  )
}
const DAY_IN_MS = 24 * 60 * 60 * 1000
const getDomain = (domain: number[]) => [
  Math.min(...domain),
  Math.max(...domain),
]

const createScales = (
  dataPoints: RawData[],
  width: number,
  gHeight: number,
  padding: number,
) => {
  const onlyOne = dataPoints.length === 1
  const onlyOneDate = dataPoints[0].date
  const dateTimes = getDomain(
    !onlyOne
      ? dataPoints.map(pair => pair.date)
      : [
          onlyOneDate - DAY_IN_MS * 4,
          onlyOneDate - DAY_IN_MS * 3,
          onlyOneDate - DAY_IN_MS * 2,
          onlyOneDate - DAY_IN_MS,
          onlyOneDate,
          onlyOneDate + DAY_IN_MS,
          onlyOneDate + DAY_IN_MS * 2,
          onlyOneDate + DAY_IN_MS * 3,
          onlyOneDate + DAY_IN_MS * 4,
        ],
  )
  const values = getDomain(
    !onlyOne
      ? dataPoints.map(pair => pair.value)
      : [
          dataPoints[0].value / 3,
          dataPoints[0].value + dataPoints[0].value / 3,
        ],
  )

  const scaleX = scaleTime()
    .domain(dateTimes)
    .range([padding, width - padding])

  const scaleY = scaleLinear()
    .domain(values)
    .range([gHeight - padding, padding])

  const xAxisScale = scaleTime()
    .domain([padding, width - padding])
    .range(dateTimes)

  const yAxisScale = scaleLinear()
    .domain([gHeight - padding, padding])
    .range(values)

  return { scaleX, scaleY, xAxisScale, yAxisScale }
}

function select({ graphic: { data } }: any): object {
  return { data }
}

export default connect(select)(Graphic)
