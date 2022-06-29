import React, { Component } from 'react'
import Constants from 'expo-constants'
import { SafeAreaView, View, Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import RNPDFReader from 'rn-pdf-reader-js'
import { BackButton } from 'components/BackButton/BackButton.component'
import { Color } from 'constants/Color'
import Actions from './PdfReader.actions'
import styles from './PdfReader.styles'
import { Action } from 'redux'

interface Props {
  dataUrl: string
  dispatch(action: Action): void
}

export class PdfReader extends Component<Props, { error?: any }> {
  static navigationOptions = {
    headerShown: false,
  }
  state = { error: undefined }

  render() {
    const { dispatch, dataUrl } = this.props
    const { error } = this.state
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
          }}
        >
          <Text style={{ color: 'red', textAlign: 'center' }}>
            {(error as any).toString()}
          </Text>
        </View>
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <RNPDFReader
          source={{
            base64: Platform.OS === 'ios' ? dataUrl : undefined,
            uri: Platform.OS === 'android' ? dataUrl : undefined,
          }}
          onError={(e: any) => this.setState({ error: e })}
          withPinchZoom
          withScroll
          customStyle={{
            readerContainerZoomContainer: {
              opacity: 0,
            },
            readerContainerZoomContainerButton: {
              opacity: 0,
            },
          }}
        />
        <BackButton
          onPress={() => dispatch(Actions.pdfReaderPop())}
          visible
          color={Color.tintColor}
          containerStyle={{
            marginTop: Constants.statusBarHeight + 5,
            marginLeft: 5,
            backgroundColor: Color.primaryColor,
            width: 50,
            height: 50,
            borderRadius: 25,
            opacity: 0.7,
          }}
        />
      </SafeAreaView>
    )
  }
}

function select(
  { pdfreader: { previews } }: any,
  {
    navigation: {
      state: {
        params: { uuid, url },
      },
    },
  }: any,
) {
  return { dataUrl: Platform.OS === 'ios' ? previews[uuid].dataUrl : url }
}
export default connect(select)(PdfReader)
