import * as React from 'react'
import { Video } from 'expo-av'
import styles from '../../Chat.styles'
import { Loader } from 'components/Loader/Loader.component'
import { Platform, View } from 'react-native'
import WebView from 'react-native-webview'

export interface ChatVimeoProps {
  vimeoId: string
}

const LoaderContainer: React.FunctionComponent = props => (
  <View
    {...props}
    style={{
      minWidth: 200,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 13,
    }}
  />
)

export const ChatVimeo = ({ vimeoId }: ChatVimeoProps) => {
  const [videoURI, setVideoURI] = React.useState(null)
  const [posterURI, setPosterURI] = React.useState(null)
  const [isPrivate, setIsPrivate] = React.useState(false)
  const [isReadyForDisplay, setReadyForDisplay] = React.useState(
    Platform.select({ android: true, default: false }),
  )
  React.useEffect(() => {
    if (vimeoId) {
      fetch(`https://player.vimeo.com/video/${vimeoId}/config`)
        .then(async res => {
          return { data: await res.json(), status: res.status }
        })
        .then((result: { status: number; data: any }) => {
          if (result.status < 400) {
            setVideoURI(
              result.data?.request?.files?.progressive?.sort(
                (a: any, b: any) => a.width - b.width,
              )[0].url,
            )
            setPosterURI(result.data?.video?.thumbs['640'])
          } else {
            setIsPrivate(true)
            setVideoURI(result.data?.button?.link)
          }
        })
        .catch(e => {
          console.warn(e)
        })
    }
  }, [vimeoId])

  const handleOnReadyForDisplay = () => setReadyForDisplay(true)

  if (!videoURI) {
    return (
      <LoaderContainer>
        <Loader containerProps={{ style: styles.video }} />
      </LoaderContainer>
    )
  }

  if (isPrivate) {
    return (
      <View style={styles.video}>
        <WebView
          style={{ flex: 1, borderRadius: 13 }}
          source={{ uri: videoURI! }}
          allowsFullscreenVideo
        />
      </View>
    )
  }

  return (
    <>
      {!isReadyForDisplay ? (
        <LoaderContainer>
          <Loader containerProps={{ style: styles.video }} />
        </LoaderContainer>
      ) : null}
      <Video
        source={{ uri: videoURI! }}
        posterSource={{ uri: posterURI! }}
        style={[
          styles.video,
          { height: !isReadyForDisplay ? 0 : styles.video.height },
        ]}
        resizeMode={'contain'}
        usePoster={posterURI !== null}
        useNativeControls
        onReadyForDisplay={handleOnReadyForDisplay}
      />
    </>
  )
}
