import * as React from 'react'
import axios from 'axios'
import {
  View,
  TouchableOpacity,
  InteractionManager,
  TouchableWithoutFeedback,
  Image as RNImage,
} from 'react-native'
import { SafeImage as Image } from 'react-native-safe-image'

import { connect } from 'react-redux'

import PhotoViewerActions from 'screens/PhotoViewer/PhotoViewer.actions'
import PdfReaderActions from 'screens/PdfReader/PdfReader.actions'
import { Loader } from 'components/Loader/Loader.component'
import { Env } from 'env'
import { Layout } from 'constants/Layout'

import styles from './ChatAttachement.styles'
import { ChatMessage, MediaResource } from 'api/types'
import { Action } from 'redux'
import { PreviewType } from 'utilities/commonViewerReducer'
import { dispatchAsync } from 'utilities/dispatch.helpers'

const isPdf = (mimeType?: string) => mimeType === 'application/pdf'

const FallbackComponent = React.memo(() => (
  <View style={styles.fallback}>
    <Loader containerProps={{ style: styles.loaderContainer }} />
  </View>
))

interface Props {
  message: ChatMessage
  dispatch(action: Action): void
  position: 'left' | 'right'
  pdfreader: {
    previews: PreviewType
  }
  photoviewer: {
    previews: PreviewType
  }
  canFetchPreview: boolean
}

interface State {
  width: number
  height: number
  previewWidth: number
  previewHeight: number
  isPending: boolean
  embedFailed?: boolean
}

export class ChatAttachement extends React.Component<Props, State> {
  state: State = {
    width: 0,
    height: 0,
    previewWidth: Layout.window.width,
    previewHeight: Layout.window.height,
    embedFailed: false,
    isPending: false,
  }

  constructor(props: Props) {
    super(props)
    const { canFetchPreview } = this.props
    if (canFetchPreview) {
      this.fetchPreview()
    }
  }

  fetchPreview = () => {
    const { message, dispatch, pdfreader, photoviewer } = this.props
    const mediaId = message.mediaResource?.uuid!

    if (message.isEmbedImage && message.image) {
      axios({
        url: message.image,
        method: 'HEAD',
      })
        .then(response => {
          const contentType =
            response.headers['Content-Type'] || response.headers['content-type']
          if (contentType?.startsWith('image')) {
            RNImage.prefetch(message.image!)
            this.setState({ embedFailed: false })
          } else {
            this.setState({ embedFailed: true })
          }
        })
        .catch(() => {
          this.setState({ embedFailed: true })
        })
      return
    }

    if (isPdf(message.mediaResource?.mimeType!)) {
      if (
        mediaId &&
        (!pdfreader.previews[mediaId] ||
          (pdfreader.previews[mediaId] && !pdfreader.previews[mediaId].dataUrl))
      ) {
        dispatch(
          PdfReaderActions.pdfReaderPreviewRequested(message.mediaResource),
        )
      }
    } else {
      if (
        mediaId &&
        (!photoviewer.previews[mediaId] ||
          (photoviewer.previews[mediaId] &&
            !photoviewer.previews[mediaId].dataUrl))
      ) {
        dispatch(
          PhotoViewerActions.photoViewerPreviewRequested(message.mediaResource),
        )
      }
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const { message, pdfreader, photoviewer, canFetchPreview } = this.props

    if (canFetchPreview !== nextProps.canFetchPreview) {
      return true
    }

    const mediaId = message.mediaResource?.uuid!
    if (message.mediaResource && isPdf(message.mediaResource?.mimeType!)) {
      if (
        !nextProps?.pdfreader?.previews[mediaId] ||
        !pdfreader.previews[mediaId]
      ) {
        return true
      }
      return (
        (pdfreader.previews[mediaId] &&
          nextProps?.pdfreader?.previews[mediaId] &&
          nextProps?.pdfreader?.previews[mediaId].loading) ||
        pdfreader.previews[mediaId].dataUrl !==
          nextProps.pdfreader.previews[mediaId].dataUrl
      )
    } else {
      if (
        !nextProps?.photoviewer?.previews[mediaId] ||
        !photoviewer.previews[mediaId]
      ) {
        return true
      }
      return (
        (photoviewer.previews[mediaId] &&
          nextProps?.photoviewer?.previews[mediaId] &&
          nextProps?.photoviewer?.previews[mediaId].loading) ||
        photoviewer.previews[mediaId].dataUrl !==
          nextProps.photoviewer.previews[mediaId].dataUrl
      )
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.canFetchPreview === false &&
      this.props.canFetchPreview === true
    ) {
      this.fetchPreview()
    }
  }

  getUri() {
    const {
      message: { mediaResource, isEmbedImage, image },
      pdfreader: { previews: pdfPreview },
      photoviewer: { previews: photoPreview },
    } = this.props
    if (mediaResource && isPdf(mediaResource?.mimeType!)) {
      return (
        pdfPreview &&
        pdfPreview[mediaResource?.uuid!] &&
        pdfPreview[mediaResource?.uuid!].dataUrl
      )
    }

    if (
      photoPreview &&
      photoPreview[mediaResource?.uuid!] &&
      photoPreview[mediaResource?.uuid!].dataUrl &&
      !isEmbedImage
    ) {
      return photoPreview[mediaResource?.uuid!].dataUrl
    }

    return image
  }

  openImage = async () => {
    const { dispatch, message } = this.props
    const { mediaResource, image } = message

    this.setState({ isPending: true })
    if (!message.isEmbedImage) {
      await dispatchAsync(
        dispatch,
        PhotoViewerActions.navigateToPhotoViewer(
          mediaResource as MediaResource,
        ),
      )
    } else {
      await dispatchAsync(
        dispatch,
        PhotoViewerActions.navigateToPhotoViewer(image as string),
      )
    }

    this.setState({ isPending: false })
  }

  isLoadingPreview = () => {
    const { pdfreader, photoviewer, message } = this.props
    const { mediaResource } = message

    if (message.isEmbedImage) {
      return false
    }

    if (!mediaResource || !pdfreader.previews || !photoviewer.previews) {
      return true
    }

    if (mediaResource && isPdf(mediaResource!.mimeType!)) {
      return (
        pdfreader.previews &&
        pdfreader.previews[mediaResource!.uuid!] &&
        pdfreader.previews[mediaResource!.uuid!].loading
      )
    }

    return (
      photoviewer.previews &&
      photoviewer.previews[mediaResource!.uuid!] &&
      photoviewer.previews[mediaResource!.uuid!].loading
    )
  }

  renderPreview() {
    const uri = this.getUri()
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={styles.image}
          blurRadius={1}
          fallbackComponent={<FallbackComponent />}
        />
      )
    }
    return <FallbackComponent />
  }

  renderImage() {
    const { isPending } = this.state
    return (
      <TouchableOpacity disabled={isPending} onPress={this.openImage}>
        {this.renderPreview()}
      </TouchableOpacity>
    )
  }

  handleGoToPdf = () => {
    const { message, dispatch } = this.props
    this.setState({ isPending: true }, () => {
      dispatch(PdfReaderActions.pdfReaderPush(message.mediaResource))
    })
    InteractionManager.runAfterInteractions(() => {
      this.setState({ isPending: false })
    })
  }
  renderPdf() {
    const { isPending } = this.state
    return (
      <TouchableOpacity disabled={isPending} onPress={this.handleGoToPdf}>
        <Image
          source={{
            uri: `${Env.api.base}/messaging/pdf.jpeg`,
            cache: 'force-cache',
          }}
          style={styles.image}
          blurRadius={1}
        />
      </TouchableOpacity>
    )
  }

  handleGoToDetail = () => {
    const { dispatch, message } = this.props
    const { mediaResource } = message
    const isLoading = this.isLoadingPreview()
    if (!isLoading) {
      if (isPdf(mediaResource?.mimeType!)) {
        dispatch(PdfReaderActions.pdfReaderPush(mediaResource))
      } else {
        this.openImage()
      }
    }
  }

  render() {
    const { message } = this.props
    const { mediaResource, isEmbedImage } = message
    if (
      (!mediaResource && !isEmbedImage) ||
      this.state.embedFailed ||
      message.isEmbedVideo
    ) {
      return null
    }
    const content = !isPdf(mediaResource && mediaResource!.mimeType!)
      ? this.renderImage()
      : this.renderPdf()
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleGoToDetail}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        {content}
      </View>
    )
  }
}

function select({
  pdfreader,
  photoviewer,
  loadingStack: {
    pendingActions: { PHOTOVIEWER_PREVIEW },
  },
}: any) {
  return {
    pdfreader,
    photoviewer,
    canFetchPreview:
      PHOTOVIEWER_PREVIEW <= 10 || PHOTOVIEWER_PREVIEW === undefined,
  }
}

export default connect(select)(ChatAttachement)
