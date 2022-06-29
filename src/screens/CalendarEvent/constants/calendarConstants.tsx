import React from 'react'
import { Color } from 'constants/Color'
import i18n from 'ex-react-native-i18n'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

const renderFabActionItem = (
  title: string,
  icon: string,
  bg: string,
  type?: string,
) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        color: Color.gradientBlueLL,
        marginRight: 4,
      }}
    >
      {i18n.t(title)}
    </Text>
    <Icon
      name={icon}
      size={18}
      color={Color.white}
      type={type}
      containerStyle={{
        borderRadius: 24,
        padding: 12,
        backgroundColor: bg,
      }}
    />
  </View>
)
const eventsIcons = {
  appointment: {
    color: '#8950b6',
  },
  activity: {
    type: 'zocial',
    name: 'pinboard',
    color: '#fba81f',
  },
  nutrition: {
    type: 'material',
    name: 'dinner-dining',
    color: '#2a6df7',
  },
  exercise: {
    type: 'material',
    name: 'sports-handball',
    color: '#26debd',
  },
  coaching: {
    type: 'material',
    name: 'sports-handball',
    color: 'red',
  },
}
const calendarConstants: {
  eventsIcons: any
  fabActions: any[]
} = {
  eventsIcons,
  fabActions: [
    {
      name: 'appointments',
      position: 1,
      render: () => {
        return renderFabActionItem(
          'appointmentslist.subtitle',
          'event-note',
          eventsIcons.appointment.color,
        )
      },
    },
    {
      name: 'exercise',
      position: 2,
      render: () => {
        return renderFabActionItem(
          'exercise',
          eventsIcons.exercise.name,
          eventsIcons.exercise.color,
        )
      },
    },
    {
      name: 'nutrition',
      position: 3,
      render: () => {
        return renderFabActionItem(
          'nutrition',
          eventsIcons.nutrition.name,
          eventsIcons.nutrition.color,
        )
      },
    },
    {
      name: 'activity',
      position: 4,
      render: () => {
        return renderFabActionItem(
          'activity',
          eventsIcons.activity.name,
          eventsIcons.activity.color,
          eventsIcons.activity.type,
        )
      },
    },
  ],
}

export default calendarConstants
