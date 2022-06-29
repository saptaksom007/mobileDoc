import React from 'react'
import { connect } from 'react-redux'
import { lt, pathOr, length, pipe } from 'ramda'
import { NavigationScreenProp } from 'react-navigation'

import { Loader } from 'components/Loader/Loader.component'
import { filterOldAppointment } from 'api/appointments'

interface Props {
  navigation?: NavigationScreenProp<any>
  logged?: boolean
  appointed?: boolean
}

const isLoggedIn = pathOr(false, ['isLoggedIn'])

const hasAppointment = pipe(
  pathOr([], ['rawList']),
  filterOldAppointment,
  length,
  lt(0),
)

export class AuthLoading extends React.Component<Props> {
  static navigationOptions = {
    headerMode: 'none',
  }

  componentDidMount() {
    this.navigate()
  }

  navigate = () => {
    const { appointed, logged, navigation } = this.props
    if (navigation) {
      if (appointed && !logged) {
        navigation.navigate('Appointment')
      } else if (logged) {
        navigation!.navigate('App')
      } else {
        navigation!.navigate('Auth')
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.logged !== this.props.logged && this.props.logged === false) {
      if (this.props.appointed) {
        this.props.navigation!.navigate('Appointment')
      } else {
        this.props.navigation!.navigate('Auth')
      }
    }
  }

  render() {
    return <Loader info='AuthLoading' withLogo />
  }
}

export default connect(({ login, appointmentslist }: any) => ({
  logged: isLoggedIn(login),
  appointed: hasAppointment(appointmentslist),
}))(AuthLoading)
