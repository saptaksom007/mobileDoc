import React from 'react'
import * as Sentry from 'sentry-expo'
import { SampleError } from 'components/SampleError/SampleError.component'

interface Props {
  children: any
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    if (!__DEV__) {
      Sentry.Native.captureException(error)
    }
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <SampleError />
    }
    return this.props.children
  }
}
