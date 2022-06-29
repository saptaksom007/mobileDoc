import React, { Component } from 'react'
import { InteractionManager } from 'react-native'
import { connect } from 'react-redux'

import { pipe, pathOr, intersection, head, filter } from 'ramda'
import { compose } from 'recompose'

import ListContainer from 'components/ListContainer/ListContainer.component'
import EmptyList from 'components/EmptyList/EmptyList.component'
import { striptagsText, decodeText } from 'utilities/html'
import Conversation from 'components/Conversation/Conversation.component'
import withSubtitle from 'screens/enhancers/withSubtitle'
import withoutKeyboard from 'screens/enhancers/withoutKeyboard'

import filters from 'common-docdok/lib/utils/filters'
import { messagingActions } from 'common-docdok/lib/domain/messaging/actions'
import uncheckedMessages from 'common-docdok/lib/domain/messaging/selectors/uncheckedMessages'
import sorters from 'common-docdok/lib/utils/sorters'
import { getTestId } from 'utilities/environment'
import dateUtil from 'common-docdok/lib/utils/dateUtils'
import Actions from './ConversationsList.actions'
import { Action } from 'redux'

const testId = getTestId('conversationlist')

function getText(conversation: any) {
  return pipe(
    pathOr('', ['latestMessage', 'text']),
    striptagsText,
    decodeText,
  )(conversation)
}

const isChat = (f: any) => f.type === 'CHAT'
const noFilter = () => true
const getOtherFilter = pathOr(noFilter, ['state', 'params', 'otherFilter'])
const isDoctor = (user: any) =>
  user && user.authorities && user.authorities.includes('ROLE_PHYSICIAN')

interface Props {
  dispatch(action: Action): void
  messaging: any
  users: any
  navigation: {
    state: {
      params: {
        otherFilter(): void
      }
    }
  }
}

export class ConversationsList extends Component<Props> {
  componentDidMount() {
    const {
      messaging: { conversations },
      navigation,
    } = this.props
    const otherFilter = getOtherFilter(navigation)
    InteractionManager.runAfterInteractions(() => {
      const allconvs: any[] = filters.values(conversations)
      const convs = allconvs.filter(isChat).filter(otherFilter || noFilter)

      if (convs.length === 1) {
        this.gotoChat(convs[0])
      }
    })
  }

  gotoChat(conv: any) {
    const { dispatch } = this.props
    dispatch(Actions.gotoChatRequested(conv.id))
  }

  caculateBadgeNumber(conv: any) {
    const { messaging } = this.props
    return uncheckedMessages(messaging, conv.id)
  }

  renderRow = ({ item: conv }: any) => {
    const { users } = this.props
    const date = dateUtil.toDate(
      pathOr(undefined, ['latestMessage', 'postedAt'])(conv),
    )
    const content = getText(conv)

    const doctorId = pipe(
      filter(isDoctor),
      Object.keys,
      // @ts-ignore
      intersection(conv.subscriptions.map((sub: any) => sub.userRef)),
      head,
    )(users)

    const avatarUrl =
      (users[doctorId] && users[doctorId].avatarPicture) || undefined
    return (
      <Conversation
        avatarUrl={avatarUrl}
        title={conv.title}
        content={content}
        badgeNumber={this.caculateBadgeNumber(conv)}
        postedAt={date}
        onPress={() => this.gotoChat(conv)}
        iconName={content ? 'chat' : undefined}
      />
    )
  }

  render() {
    const {
      messaging: { conversations },
      dispatch,
      navigation,
    } = this.props
    const otherFilter = getOtherFilter(navigation)
    const convs = filters
      .values(conversations)
      .filter(isChat)
      .filter(otherFilter || noFilter)
      .sort(sorters.sortByPostedAt)

    if (!convs || convs.length === 0) {
      return (
        <EmptyList
          onPress={() => {
            dispatch(messagingActions.getSubscriptionsRequested())
          }}
        />
      )
    }

    return (
      <ListContainer testID={testId} data={convs} renderItem={this.renderRow} />
    )
  }
}

function select({ messaging, userCache: { users } }: any) {
  return {
    messaging,
    users,
  }
}

export default compose<Props, any>(
  withoutKeyboard,
  connect(select),
  withSubtitle('conversationslist.subtitle'),
)(ConversationsList)
