import React, { Component, RefObject } from 'react'
import { View } from 'react-native'
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
// import HTMLView from 'react-native-htmlview'

import styles from './AppRichTextArea.styles'

interface Props {
  value: string
  onChangeText(text: string): void
  onAddAttachment(type: string, cb: any): void
  attachment: boolean
}

export class AppRichTextAreaComponent extends Component<Props> {
  RichText: RefObject<any>

  static defaultProps = {
    // placeholder: 'default',
  }

  state = {
    content: '',
  }
  constructor(props: Props) {
    super(props)
    this.RichText = React.createRef()
  }

  render() {
    const editorInitializedCallback = () => {
      if (this.RichText) {
        this.RichText.current?.setContentHTML(this.props.value)
        this.RichText.current?.registerToolbar(() => null)
      }
    }

    const onPressAddImage = () => {
      // you can easily add images from your gallery
      if (this.RichText) {
        this.props.onAddAttachment('library', () => {
          // this.RichText.current?.insertImage(
          //   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
          // )
        })
      }
    }

    const onPressAddImageViaCamera = () => {
      // you can easily add images from your gallery
      if (this.RichText) {
        this.props.onAddAttachment('camera', () => {
          // this.RichText.current?.insertImage(
          //   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
          // )
        })
      }
    }

    const {} = this.props
    if (this.RichText === null || !this.RichText) {
      return null
    }

    let actions = ['bold', 'italic', 'unorderedList', 'orderedList', 'link']

    if (this.props.attachment) {
      actions = ['camera', 'image', ...actions]
    }

    console.log('this.props.value', this.props.value)
    return (
      <View style={styles.container}>
        <RichEditor
          initialContentHTML={this.props.value}
          disabled={false}
          containerStyle={styles.editor}
          ref={this.RichText}
          style={styles.rich}
          placeholder={'Start Writing Here'}
          onChange={text => {
            this.setState({ content: text })
            this.props.onChangeText(text)
          }}
          editorInitializedCallback={editorInitializedCallback}
        />
        <RichToolbar
          style={[styles.richBar]}
          editor={this.RichText}
          disabled={false}
          iconTint={'purple'}
          selectedIconTint={'pink'}
          disabledIconTint={'purple'}
          onPressAddImage={onPressAddImage}
          actions={actions}
          iconMap={{
            camera: require('./../../assets/images/camera-icon-21.png'),
          }}
          // @ts-ignore
          camera={onPressAddImageViaCamera}
        />
      </View>
    )
  }
}
