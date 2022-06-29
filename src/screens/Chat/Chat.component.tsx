import React, { Component } from 'react'

import {
  View,
  TouchableOpacity,
  InteractionManager,
  Platform,
  Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import { v4 } from 'uuid'
import { WebView } from 'react-native-webview'

import {
  GiftedChat,
  Bubble,
  Composer,
  LoadEarlier,
  MessageText,
  Time,
  Avatar as GiftedAvatar,
  SystemMessage,
  MessageImage,
  Send,
  IMessage,
  Reply,
} from 'react-native-gifted-chat'
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils'
import {
  connectActionSheet,
  ActionSheetProps,
} from '@expo/react-native-action-sheet'
import { Icon } from 'react-native-elements'

import { compose } from 'recompose'
import { propEq, pathOr, head } from 'ramda'

import { NavigationScreenProp } from 'react-navigation'

import { Small } from 'components/CustomText/CustomText.component'
import { fontFamily } from 'components/CustomText/CustomText.styles'
import NotificationsActions from 'notifications/actions'
import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'
import i18n from 'ex-react-native-i18n'

import { Color } from 'constants/Color'
import { getTestId } from 'utilities/environment'

import Subtitle from 'components/Subtitle/Subtitle.component'
import { getImagePickerFromIndex } from 'utilities/image'

import { isLoading } from 'common-docdok/lib/common/LoadingStack/selectors'
import {
  messagingActions,
  messagingActionTypes,
} from 'common-docdok/lib/domain/messaging/actions'

import constants from 'common-docdok/lib/utils/constants'

import { Loader } from 'components/Loader/Loader.component'

import { Avatar } from 'components/Avatar/Avatar.component'
import { withLoader } from 'screens/enhancers/withLoader'

import ChatBotMessage from './components/ChatBotMessage/ChatBotMessage.component'
import ChatAttachement from './components/ChatAttachement/ChatAttachement.component'

import Actions from './Chat.actions'
import styles from './Chat.styles'
import { transformMessagesMap } from '../../api/conversations'
import { calculateLineHeight } from '../../components/CustomText/CustomText.styles'
import { Action } from 'redux'
import { ChatMessage } from 'api/types'
import { Video } from 'expo-av'
import { isSmallScreen } from 'utilities/responsive'
import { surveyActions } from 'common-docdok/lib/domain/survey/actions'
import GraphicActions from 'screens/Graphic/Graphic.actions'
import { dispatchAsync } from 'utilities/dispatch.helpers'
import { waitEndOfInteractions } from 'utilities/waitEndOfInteraction'
import { getTitleConversation } from 'utilities/messaging'
import { MessageDtoType } from 'common-docdok/lib/types'
import { ChatVimeo } from './components/ChatVimeo/ChatVimeo.component'

const NB_OF_MSG_BY_LOAD = 10
const MIN_NB_OF_MSG_BY_LOAD = 5

const READ_ONLY_ACCESS = constants.SUBSCRIPTION_READ_ONLY

const mainTestId = getTestId('chat')
const photoTestId = getTestId('add-a-photo')

const isRight = (position: string) =>
  position && position !== 'left' && position === 'right'

function isAppointmentRequest(message: ChatMessage): boolean {
  const { meta } = message
  return !!meta && !!meta.subtype && meta.subtype === 'appointmentRequest'
}

function isSurvey(message: ChatMessage): boolean {
  const { meta } = message
  return (
    !!meta &&
    !!meta.notificationtype &&
    meta.notificationtype.includes('SURVEY')
  )
}

function isVideoInvitationRequest(message: ChatMessage): boolean {
  const { meta } = message
  return !!meta && !!meta.subtype && meta.subtype === 'videoInvitation'
}

const renderAvatar = ({ currentMessage }: GiftedAvatar['props']) => (
  <Avatar
    size={36}
    name={currentMessage && currentMessage.user && currentMessage.user.name}
    url={
      currentMessage && currentMessage.user && currentMessage.user.avatar
        ? (currentMessage.user.avatar as string)
        : undefined
    }
  />
)

const renderSystemMessage = ({
  currentMessage,
}: SystemMessage['props'] & {
  currentMessage: SystemMessage['props']['currentMessage'] & { meta: any }
}) => {
  const { meta } = currentMessage

  return (
    <View style={styles.metaMessageContainer}>
      <View style={styles.metaMessageWrapper}>
        <Small style={styles.metaMessageText}>
          {i18n.t(`chat.events.${meta ? meta.eventKey : 'default'}`, {
            user: meta && meta.user,
          })}
        </Small>
      </View>
    </View>
  )
}

const renderTicks = () => null

const shouldShowName = ({
  currentMessage,
  previousMessage,
  user,
}: Bubble['props']) =>
  (currentMessage &&
    previousMessage &&
    isSameUser(currentMessage, previousMessage) &&
    isSameDay(currentMessage, previousMessage)) ||
  currentMessage!.user._id !== user!._id

const renderBubble = (props: Bubble['props']) => {
  const lineHeight = calculateLineHeight(16)
  const { currentMessage, nextMessage, position } = props
  const isLastCurrentUser =
    isSameUser &&
    isSameUser(currentMessage as IMessage, nextMessage as IMessage) &&
    isSameDay &&
    isSameDay(currentMessage as IMessage, nextMessage as IMessage)

  const noBackgroundColor =
    isAppointmentRequest(currentMessage as ChatMessage) ||
    isSurvey(currentMessage as ChatMessage) ||
    isVideoInvitationRequest(currentMessage as ChatMessage)

  if (isRight(position!)) {
    return (
      <Bubble<IMessage>
        renderMessageVideo={renderVideo}
        renderTicks={renderTicks}
        {...props}
        wrapperStyle={{
          right: [
            styles.bubbleRight,
            noBackgroundColor ? { backgroundColor: 'transparent' } : undefined,
          ],
          left: [
            styles.bubbleLeft,
            noBackgroundColor ? { backgroundColor: 'transparent' } : undefined,
          ],
        }}
        textStyle={{
          left: { fontFamily, lineHeight },
          right: { fontFamily, lineHeight },
        }}
      />
    )
  }
  if (isLastCurrentUser) {
    return (
      <Bubble<IMessage>
        renderMessageVideo={renderVideo}
        renderTicks={renderTicks}
        {...props}
        touchableProps={{
          testID: getTestId('last-bubble'),
          accessibilityLabel: getTestId('last-bubble'),
        }}
        wrapperStyle={{
          right: [
            styles.bubbleRight,
            noBackgroundColor ? { backgroundColor: 'transparent' } : undefined,
          ],
          left: [
            styles.bubbleLeft,
            noBackgroundColor ? { backgroundColor: 'transparent' } : undefined,
          ],
        }}
        textStyle={{
          left: { fontFamily, lineHeight },
          right: { fontFamily, lineHeight },
        }}
      />
    )
  }
  return (
    <View>
      <Bubble<IMessage>
        renderMessageVideo={renderVideo}
        renderTicks={renderTicks}
        {...props}
        currentMessage={currentMessage as IMessage}
        wrapperStyle={{
          right: [],
          left: [
            styles.bubbleLeft,
            noBackgroundColor ? { backgroundColor: 'transparent' } : undefined,
          ],
        }}
        textStyle={{
          left: { fontFamily, lineHeight },
          right: { fontFamily, lineHeight },
        }}
      />

      {shouldShowName(props) && (
        <Small style={[styles.name, styles.bubbleLeft]}>
          {currentMessage && currentMessage.user && currentMessage.user.name}
        </Small>
      )}
    </View>
  )
}

const renderImage = (
  props: MessageImage['props'] & { position: 'left' | 'right' },
) => {
  const { currentMessage, position } = props
  if (currentMessage && position) {
    return (
      <ChatAttachement
        message={currentMessage as ChatMessage}
        position={position}
      />
    )
  }
  return null
}

const renderVideo = (props: any) => {
  const { currentMessage } = props

  if (currentMessage.isEmbedVideo) {
    if (currentMessage.isVimeo) {
      return <ChatVimeo vimeoId={currentMessage.video} />
    }

    return (
      <View style={styles.video}>
        <WebView
          style={{ borderRadius: 13 }}
          source={{ uri: currentMessage.video }}
          allowsFullscreenVideo
          javaScriptEnabled
          scrollEnabled={false}
        />
      </View>
    )
  }
  if (currentMessage && currentMessage!.video) {
    return (
      <Video
        source={{ uri: currentMessage!.video! }}
        style={styles.video}
        resizeMode='cover'
        useNativeControls
      />
    )
  }
  return null
}

const composerTestId = getTestId('composer')
const renderComposer = (
  props: Composer['props'] & { textInputProps: { access: number } },
) => (
  <Composer
    {...props}
    textInputProps={{
      ...props.textInputProps,
      testID: composerTestId,
      accessibilityLabel: composerTestId,
      blurOnSubmit: false,
      editable: props.textInputProps.access !== READ_ONLY_ACCESS,
      selectionColor: Color.primaryColor,
    }}
    textInputStyle={{
      lineHeight: Platform.select({
        ios: 17,
        android: 20,
      }),
    }}
  />
)

const testIdSend = getTestId('chat-send-button')
const renderSend = (props: Send['props']) => {
  const { onSend, text } = props
  if (text && text.trim().length > 0) {
    return (
      <TouchableOpacity
        style={styles.sendContainer}
        onPress={() => {
          if (onSend) {
            onSend({ text: text.trim() }, true)
          }
        }}
        accessibilityTraits='button'
        accessibilityLabel={testIdSend}
        testID={testIdSend}
      >
        <Icon name='send' color={Color.tintColor} size={24} />
      </TouchableOpacity>
    )
  }
  return <View />
}

const renderQuickReplySend = () => (
  <Icon name='send' color={Color.tintColor} size={24} />
)

const parseBot = (text: string) => {
  const firstSplit: string[] = text.split('\n')
  const prefs = firstSplit.slice(1)
  return {
    title: firstSplit[0],
    items:
      prefs.length > 1
        ? prefs.map((item: any) => ({
            title: item.split(':')[0],
            subtitle: item.split(':')[1] && item.split(':')[1].trim(),
          }))
        : undefined,
  }
}

const renderMessageText = (props: MessageText['props']) => {
  const { currentMessage } = props
  if (
    isAppointmentRequest(currentMessage as ChatMessage) ||
    isSurvey(props.currentMessage as ChatMessage) ||
    isVideoInvitationRequest(props.currentMessage as ChatMessage)
  ) {
    return null
  }
  return <MessageText {...props} />
}

const renderTime = (props: Time['props']) => {
  if (
    isAppointmentRequest(props.currentMessage as ChatMessage) ||
    isSurvey(props.currentMessage as ChatMessage) ||
    isVideoInvitationRequest(props.currentMessage as ChatMessage)
  ) {
    return null
  }
  return <Time {...props} />
}

interface Props extends ActionSheetProps {
  dispatch(action: Action): void
  messages: IMessage[]
  isTyping: boolean
  latestMessage: MessageDtoType
  profile: { uid: string }
  refreshing?: boolean
  navigation: NavigationScreenProp<{ text?: string; conversationTitle: string }>
  cachedAttachments?: any
  selectedConversation: number
  access?: number
  mySurveys?: any[]
  conversationTitle: string
}

interface State {
  text?: string
  currentNumberOfMessageMax: number
}

export class Chat extends Component<Props, State> {
  state: State = {
    text: undefined,
    currentNumberOfMessageMax: this.props.messages
      .slice(0, MIN_NB_OF_MSG_BY_LOAD)
      .some(m =>
        (m as ChatMessage).mediaResource?.mimeType?.startsWith('image'),
      )
      ? MIN_NB_OF_MSG_BY_LOAD
      : NB_OF_MSG_BY_LOAD,
  }
  didFocusSubscriber: { remove(): void }
  videoProps = {
    useNativeControls: true,
  }

  handleFocus = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(surveyActions.getMySurveysRequested())
    })
  }

  componentDidMount() {
    this.didFocusSubscriber = this.props.navigation.addListener(
      'didFocus',
      this.handleFocus,
    )
    InteractionManager.runAfterInteractions(() => {
      const {
        dispatch,
        selectedConversation,
        navigation: {
          state: { params },
        },
      } = this.props
      dispatch(NotificationsActions.removeNotificationRequested())
      dispatch(ConversationsListActions.gotoChatSucceeded(selectedConversation))
      if (params && params.text) {
        this.sendMessage([{ text: params.text } as IMessage], {
          subtype: 'appointmentRequest',
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    // unselect
    dispatch(messagingActions.selectConversation())

    if (this.didFocusSubscriber) {
      this.didFocusSubscriber.remove()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.messages.length !== this.props.messages.length) {
      const {
        profile: { uid },
        latestMessage,
        dispatch,
      } = this.props
      const currentLastMessage = head(this.props.messages)
      if (currentLastMessage?.user._id !== uid) {
        dispatch(messagingActions.markAsCheckedRequested([latestMessage]))
      }
    }
  }

  openAddImageSheet = async () => {
    if (Platform.OS === 'android') {
      Keyboard.dismiss()
      await waitEndOfInteractions()
    }
    const { showActionSheetWithOptions, dispatch } = this.props
    const options = [
      i18n.t('chat.actionSheet.camera'),
      i18n.t('chat.actionSheet.library'),
      i18n.t('global.cancel'),
    ]
    const cancelButtonIndex = 2
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        InteractionManager.runAfterInteractions(() => {
          if (buttonIndex !== cancelButtonIndex) {
            dispatch(
              Actions.addPhotoRequested(getImagePickerFromIndex(buttonIndex)),
            )
          }
        })
      },
    )
  }

  sendMessage = (messages: IMessage[], meta?: any) => {
    const { dispatch, selectedConversation } = this.props
    dispatch(
      messagingActions.postMessageRequested(
        selectedConversation,
        messages[0].text,
        null,
        meta,
      ),
    )
  }

  renderActions = () =>
    this.props.access === READ_ONLY_ACCESS ? null : (
      <View
        testID={photoTestId}
        accessibilityLabel={photoTestId}
        style={styles.actionContainer}
      >
        <TouchableOpacity
          onPress={this.openAddImageSheet}
          hitSlop={{ top: 5, left: 5, bottom: 5 }}
        >
          <Icon name='add-a-photo' color={Color.tintColor} size={24} />
        </TouchableOpacity>
      </View>
    )

  renderLoadEarlier = (props: any) => (
    <LoadEarlier
      label={i18n.t('chat.loadEarlier')}
      {...props}
      wrapperStyle={{ backgroundColor: Color.tintColor }}
    />
  )

  onQuickReply = (replies: Reply[]) => {
    const { profile, messages } = this.props
    const _id = profile.uid as string
    const messageId = replies[0].messageId
    const originalMessages = messages.find(
      (message: IMessage) => message._id === messageId,
    )

    this.sendMessage(
      [
        {
          _id: v4(),
          text: replies.map((reply: Reply) => reply.title).join(', '),
          user: { _id },
          createdAt: new Date(),
        },
      ],
      {
        subtype: 'quickreply',
        notificationtype: 'CHAT',
        interaction: {
          result: {
            name: pathOr(
              undefined,
              ['meta', 'interaction', 'name'],
              originalMessages,
            ),
            value: replies.map((reply: Reply) => reply.value),
          },
        },
        context: pathOr(undefined, ['meta', 'context'], originalMessages),
        answers: replies[0].messageId,
      },
    )
  }

  renderCustomView = ({
    currentMessage,
    currentMessage: { text },
    position,
  }: any) => {
    if (isAppointmentRequest(currentMessage)) {
      const { title, items } = parseBot(text)
      return (
        <ChatBotMessage
          title={title}
          items={items}
          iconName='calendar-plus'
          iconType='material-community'
          iconContainerStyle={{ paddingTop: 3 }}
          position={position}
        />
      )
    }

    if (isSurvey(currentMessage)) {
      const survey = this.props.mySurveys
        ? this.props.mySurveys.find(
            s => s.id === Number(currentMessage.meta.id),
          )
        : {}
      const isComplete = survey && !!survey.completionDate
      return (
        <ChatBotMessage
          title={text}
          items={[
            {
              subtitle: isComplete
                ? i18n.t('chat.surveyMessage.complete')
                : i18n.t('chat.surveyMessage.startSurvey'),
              onPress: isComplete
                ? () =>
                    this.props.dispatch(
                      GraphicActions.graphicRequested(
                        Number(currentMessage.meta.surveyId),
                        currentMessage.meta.patientuuid,
                      ),
                    )
                : () =>
                    this.props.dispatch(
                      Actions.goToSurveyRequested(currentMessage.meta.id),
                    ),
            },
          ]}
          iconName='show-chart'
          iconType='material'
          position={position}
        />
      )
    }

    if (isVideoInvitationRequest(currentMessage)) {
      const { invitationUrl } = currentMessage.meta

      return (
        <ChatBotMessage
          title={text}
          items={[
            {
              subtitle: i18n.t('chat.videoinvitation.clickme'),
              onPress: () =>
                this.props.dispatch(
                  Actions.goToVideoChatRequested(invitationUrl),
                ),
            },
          ]}
          iconName='video-call'
          iconType='material'
          position={position}
        />
      )
    }

    return null
  }

  increaseNumberOfMessage = () =>
    this.setState(state => ({
      currentNumberOfMessageMax:
        state.currentNumberOfMessageMax + NB_OF_MSG_BY_LOAD,
    }))

  handleLoadEarlier = async () => {
    const { selectedConversation, dispatch, messages } = this.props
    const { currentNumberOfMessageMax } = this.state
    if (currentNumberOfMessageMax + NB_OF_MSG_BY_LOAD > messages.length) {
      const result = await dispatchAsync(
        dispatch,
        messagingActions.loadOlderMessagesRequested(selectedConversation),
      )
      if (result.success) {
        this.increaseNumberOfMessage()
      }
    } else {
      this.increaseNumberOfMessage()
    }
  }

  renderLoader = () => <Loader />

  renderScrollToBottom = () => (
    <Icon name='keyboard-arrow-down' color={Color.tintColor} size={24} />
  )

  handleTextChange = (text: string) => this.setState({ text })

  renderChat = () => {
    const { messages, profile, refreshing, access, isTyping } = this.props
    const subsetMessages = messages.slice(
      0,
      this.state.currentNumberOfMessageMax,
    )

    const shouldLoadEarlier =
      subsetMessages.length > 1 &&
      subsetMessages.filter(propEq('sequenceNo', 0)).length === 0

    const user = { _id: profile && profile.uid }
    const placeholder =
      access !== READ_ONLY_ACCESS
        ? i18n.t('chat.composer.placeholder')
        : i18n.t('chat.composer.readOnly')
    return (
      <GiftedChat
        onQuickReply={this.onQuickReply}
        messages={subsetMessages}
        text={this.state.text}
        onInputTextChanged={this.handleTextChange}
        onSend={this.sendMessage}
        locale={i18n.getFallbackLocale()}
        user={user}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderAvatar={renderAvatar}
        renderComposer={renderComposer}
        renderLoadEarlier={this.renderLoadEarlier}
        renderSystemMessage={renderSystemMessage}
        renderCustomView={this.renderCustomView}
        renderMessageText={renderMessageText}
        renderMessageImage={renderImage}
        renderActions={this.renderActions}
        renderTime={renderTime}
        renderQuickReplySend={renderQuickReplySend}
        placeholder={placeholder}
        keyboardShouldPersistTaps='never'
        renderLoading={this.renderLoader}
        loadEarlier={shouldLoadEarlier}
        isLoadingEarlier={subsetMessages.length !== 0 && refreshing}
        onLoadEarlier={this.handleLoadEarlier}
        scrollToBottom
        scrollToBottomComponent={this.renderScrollToBottom}
        forceGetKeyboardHeight={
          Platform.OS === 'android' && Platform.Version < 21
        }
        textInputProps={{ access }}
        infiniteScroll
        isTyping={isTyping}
      />
    )
  }

  render() {
    const { conversationTitle } = this.props

    return (
      <View
        style={styles.container}
        testID={mainTestId}
        accessibilityLabel={mainTestId}
      >
        {!isSmallScreen() && (
          <Subtitle
            subtitle={conversationTitle}
            noTranslation
            noIcon
            smallTitle
          />
        )}
        <View style={styles.chatContainer}>{this.renderChat()}</View>
      </View>
    )
  }
}

function select({
  messaging: { conversations, selectedConversation },
  profile,
  loadingStack,
  userCache: { users },
  survey: { mySurveys },
}: any) {
  const conversation = conversations[String(selectedConversation)]
  const currentMessages = (conversation && conversation.messages) || []
  const latestMessage = conversation?.latestMessage
  const { access } = (conversation &&
    conversation.subscriptions.find(
      (sub: any) => sub.id === conversation.subscriptionId,
    )) || { access: undefined }
  const messages = transformMessagesMap(users, currentMessages)
  const isTyping =
    messages[0] && messages[0].meta?.interaction?.result !== undefined
  return {
    isTyping,
    conversationTitle: getTitleConversation(conversation),
    access,
    messages,
    profile,
    latestMessage,
    refreshing:
      !isTyping &&
      isLoading(
        [
          messagingActionTypes.POST_MESSAGE_REQUESTED,
          messagingActionTypes.LOAD_MESSAGES_REQUESTED,
          messagingActionTypes.LOAD_OLDER_MESSAGES_REQUESTED,
          messagingActionTypes.MARK_AS_CHECKED_REQUESTED,
        ],
        loadingStack,
      ),
    selectedConversation,
    mySurveys,
  }
}

export default compose<Props, any>(
  connectActionSheet,
  connect(select),
  withLoader,
)(Chat)
