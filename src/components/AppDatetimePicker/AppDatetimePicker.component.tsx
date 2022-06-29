import React, { Component } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

import styles from './AppDatetimePicker.styles'
import { Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { Icon } from 'react-native-elements'

interface Props {
  date: Date
  mode?: any
  style?: any
  onChange(value: any): void
  placeholder?: string
  error?: string
  minimumDate?: Date
}

export class AppDatetimePicker extends Component<Props> {
  state = {
    show: false,
  }
  static defaultProps = {
    date: new Date(),
    minimumDate: new Date('1970/01/01'),
  }

  render() {
    const { date, mode, onChange, error, placeholder, minimumDate } = this.props
    return (
      <>
        <Text style={styles.label}>{placeholder}</Text>
        <TouchableOpacity
          onPress={() => this.setState({ show: !this.state.show })}
        >
          <View style={styles.container}>
            <Icon name={mode === 'time' ? 'timer' : 'event'} />
            <Text style={styles.input}>
              {moment(date).format(mode === 'date' ? 'DD.MM.YYYY' : 'HH:mm')}
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.show && (
          <DateTimePicker
            minimumDate={minimumDate}
            testID='dateTimePicker'
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={(_: any, changedDate: any) => {
              this.setState({ show: false })
              onChange(changedDate)
            }}
          />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </>
    )
  }
}
