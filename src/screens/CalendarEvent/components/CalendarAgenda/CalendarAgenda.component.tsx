import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, TouchableHighlight, Image } from 'react-native'
import CustomTextStyles from 'components/CustomText/CustomText.styles'
import { Agenda, LocaleConfig } from 'react-native-calendars'
import moment from 'moment'
import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'
import { CheckBox, Icon } from 'react-native-elements'
import { isArray, isObject } from 'lodash'
import i18n from 'ex-react-native-i18n'
import calendarConstants from 'screens/CalendarEvent/constants/calendarConstants'
import { ReservationsType } from 'react-native-calendars/src/agenda'
import { DayReservations } from 'react-native-calendars/src/agenda/reservation-list'

// @ts-ignore
import WeekView from 'react-native-week-view'
// @ts-ignore
import HTMLView from 'react-native-htmlview'
import { AddCalendarEventReqPayloadInterface } from 'api/calendarEvents'

const calendarLocaleConfig = (localeIs: string) => {
  const moment_locale = moment.localeData(localeIs)
  return {
    monthNames: moment_locale.months(),
    monthNamesShort: moment_locale.monthsShort(),
    dayNames: moment_locale.weekdays(),
    dayNamesShort: moment_locale.weekdaysShort(),
  }
}
const locale = i18n.locale.substr(0, 2)
moment.locale(locale)
LocaleConfig.locales[locale] = calendarLocaleConfig(locale)
LocaleConfig.defaultLocale = locale

export const buttonTextStyle = [
  CustomTextStyles.font,
  CustomTextStyles.small,
  {
    textAlign: 'center',
    paddingHorizontal: 2,
  },
]

const styles = StyleSheet.create({
  agendaItem: {
    minHeight: 80,
    padding: 18,
    paddingVertical: 24,
    elevation: 12,
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agendaItemBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: Layout.window.width / 2.5,
  },
  agendaItemTitle: {
    fontSize: 20,
    marginBottom: 8,
    color: Color.black,
  },
  day: {
    fontSize: 18,
    color: Color.blueD,
    fontWeight: '500',
  },
  dayItem: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyData: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyTextTitle: {
    fontWeight: '400',
    fontSize: 24,
  },
  badgeCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 0.2,
  },
  agendaItemDetails: {
    flex: 2,
  },
  locationItem: {
    marginTop: 4,
    borderTopColor: Color.blackTTTT,
    borderTopWidth: 1,
  },
  headerTextStyle: {
    backgroundColor: Color.borderColor,
    padding: 6,
    borderRadius: 18,
  },
  today: {
    backgroundColor: Color.blueD,
    color: Color.white,
  },
  headerStyle: {
    borderLeftColor: Color.borderColor,
    borderTopColor: Color.borderColor,
  },
})

interface Props {
  style?: any
  items: ReservationsType
  isWeeklyView: boolean
  onTapItem(data: any): void
  onUpdateStatus(data: any): void
  setCurrentDate(date: any): void
  currentDate?: Date
}

class CalendarAgenda extends PureComponent<Props> {
  static defaultProps = {
    items: {},
    isWeeklyView: false,
    currentDate: new Date(),
  }

  constructor(props: Props) {
    super(props)
  }

  state = {
    isWeeklyView: false,
    showCalendar: false,
  }

  render() {
    const { items, isWeeklyView, currentDate, setCurrentDate } = this.props

    console.log({ currentDate })
    const markedDates: any = {}

    if (isObject(items)) {
      Object.keys(items).forEach(item => {
        markedDates[item] = {
          marked: true,
        }
      })
    }

    if (!isObject(items)) {
      return null
    }

    const myEvents: any = []

    Object.keys(items).forEach((date: any) => {
      if (isArray(items[date])) {
        items[date].forEach((i: any) => {
          const eventType: 'activity' | 'nutrition' | 'exercise' = i.type

          myEvents.push({
            id: i?.id,
            description: i?.name,
            startDate: moment(i?.startTime).toDate(),
            endDate: moment(i?.endTime).toDate(),
            color:
              calendarConstants.eventsIcons[eventType]?.color ?? Color.black,
            details: i,
          })
        })
      }
    })

    if (isWeeklyView) {
      return (
        <WeekView
          formatDateHeader='D'
          selectedDate={currentDate}
          onEventPress={(event: any) => {
            this.props.onTapItem(event.details)
          }}
          events={myEvents}
          showTitle={true}
          numberOfDays={7}
          eventContainerStyle={{ borderRadius: 12 }}
          startHour={8}
          headerTextStyle={styles.headerTextStyle}
          headerStyle={styles.headerStyle}
          TodayHeaderComponent={({ formattedDate }: any) => (
            <Text style={[styles.headerTextStyle, styles.today]}>
              {formattedDate}
            </Text>
          )}
        />
      )
    }
    let itemToShow: ReservationsType = {}
    const itemsForDate = items?.[moment(currentDate).format('YYYY-MM-DD')] ?? []
    if (itemsForDate.length > 0) {
      itemToShow = {
        [moment(currentDate).format('YYYY-MM-DD')]:
          items?.[moment(currentDate).format('YYYY-MM-DD')] ?? [],
      }
    }
    return (
      <Agenda
        items={itemToShow}
        // Callback that gets called on day press
        onDayPress={day => {
          setCurrentDate(moment(day.timestamp).toDate())
        }}
        // @ts-ignore
        renderDay={(date: any, item?: DayReservations) => {
          console.log({ date, item })
          return null
        }}
        // @ts-ignore
        renderItem={item => {
          const eventType: 'activity' | 'nutrition' | 'exercise' = item.type

          return (
            <TouchableHighlight
              onPress={() => this.props.onTapItem(item)}
              underlayColor={Color.lightBackground}
            >
              <View style={[styles.agendaItem]}>
                <CheckBox
                  containerStyle={styles.checkboxContainer}
                  checked={item?.status === 'DONE'}
                  onPress={() => {
                    const reqPayload: AddCalendarEventReqPayloadInterface = {
                      ...item,
                      id: item.id,
                      type: String(item.type).toLowerCase(),
                      patientUuid: item?.patientUuid,
                      physicianUuid: item?.physicianUuid,
                      name: item.name,
                      startTime: `${moment(item.startTime).format(
                        'YYYY-MM-DDTHH:mm:ssZ',
                      )}`,
                      endTime: `${moment(item.endTime).format(
                        'YYYY-MM-DDTHH:mm:ssZ',
                      )}`,
                      url: '',
                      description: item.description ? item.description : '-',
                      status: item?.status === 'DONE' ? 'SCHEDULED' : 'DONE',
                      location: item.location ?? '-',
                      cb: () => {
                        setCurrentDate(moment().toDate())
                      },
                    }
                    this.props.onUpdateStatus(reqPayload)
                  }}
                />
                <View style={styles.agendaItemDetails}>
                  <Text>
                    {moment(item.startTime).format('DD-MM-YYYY HH:mm')} -{' '}
                    {moment(item.endTime).format('HH:mm')}
                  </Text>
                  <Text style={styles.agendaItemTitle}>{item.name}</Text>
                  {item?.description
                    ? false && (
                        <View>
                          <HTMLView value={item?.description ?? ''} />
                        </View>
                      )
                    : null}
                  <View style={[styles.rowCenter]}>
                    <Icon name='location-on' color={'#fba81f'} />
                    <Text>{item.location ? item.location : '-'}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.badgeCircle,
                    {
                      backgroundColor:
                        calendarConstants.eventsIcons[eventType]?.color ??
                        Color.black,
                    },
                  ]}
                ></View>
              </View>
            </TouchableHighlight>
          )
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.emptyData}>
              <Text style={[styles.emptyText, styles.emptyTextTitle]}>
                {i18n.t('feelingBlue')}
              </Text>
              <Image source={require('../../../../assets/images/empty.png')} />
              <Text style={styles.emptyText}>{i18n.t('clickPlusBtn')}</Text>
            </View>
          )
        }}
        rowHasChanged={(r1: any, r2: any) => {
          return r1.text !== r2.text
        }}
        showClosingKnob={true}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: Color.bluePrimary,
        }}
        // Agenda container style
        style={{}}
      />
    )
  }
}

export default CalendarAgenda

// https://www.npmjs.com/package/react-native-week-view
