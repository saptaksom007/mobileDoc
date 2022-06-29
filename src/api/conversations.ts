import {
  map,
  multiply,
  evolve,
  pathEq,
  cond,
  identity,
  is,
  curry,
  pipe,
} from 'ramda'
import { cleanTextChat } from 'utilities/html'
import { runAuthRequestAsync } from 'utilities/axios'

import toString from 'common-docdok/lib/utils/toString'
import { QuickReplies } from 'react-native-gifted-chat'
import { then, catchP, logAsync } from 'utilities/pointFreePromise'
import { throwApiError } from './error'
import { ChatMessage } from './types'
import { UserDtoType, MessageDtoType } from 'common-docdok/lib/types'

export const transformDateIfNeeded = cond([
  [is(Number), multiply(1000)],
  [is(String), identity],
  [is(Date), identity],
])

export const transformPostedAt = evolve({
  postedAt: transformDateIfNeeded,
})

export const transformPostedAtMap = map(transformPostedAt)

export const transformLatestMessagePostedAt = evolve({
  latestMessage: {
    postedAt: transformDateIfNeeded,
  },
})

// Predicate on subtype of chat message (event)
export const isMetaMessage = pathEq(['meta', 'subtype'], 'conversationevent')

export const transformLatestMessagePostedAtMap = map(
  transformLatestMessagePostedAt,
)

interface Choice {
  value: string
  text: string
}
interface MetaReply {
  isReplied: boolean
  isLastOne: boolean
  context: {
    externalContext: string
    externalId: string
  }
  interaction: {
    choices: Choice[]
    type: 'radiogroup' | 'checkbox'
  }
}
// TODO: add log here
const transformQuickReply = (meta: MetaReply): QuickReplies => ({
  keepIt: !meta.isReplied && meta.isLastOne,
  type: pathEq(['interaction', 'type'], 'radiogroup', meta)
    ? 'radio'
    : 'checkbox',
  values:
    (meta &&
      meta.interaction &&
      meta.interaction.choices &&
      meta.interaction.choices.map(({ value, text }: Choice) => ({
        title: text,
        value,
      }))) ||
    [],
})

const isQuickReply = pathEq(['meta', 'subtype'], 'quickreply')

const isAnswers = (messageId: number | string) =>
  pathEq(['meta', 'answers'], messageId)

const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
const getYoutubeId = (url: string) => {
  const match = url.match(youtubeRegExp)
  if (match && match[2].length === 11) {
    return match[2]
  }
  return null
}
const vimeoRegExp = /^.*(vimeo\.com\/)([0-9]*).*/
const getVimeoId = (url: string) => {
  const match = url.match(vimeoRegExp)
  if (match && match[2].length >= 5) {
    return match[2]
  }
  return null
}

const transformMessageVideo = (msg: MessageDtoType): Partial<ChatMessage> => {
  if (msg.mediaResource && msg.mediaResource.mimeType.startsWith('video')) {
    return { video: msg.mediaResource.originalUrl }
  }
  const youtubeVideoId = getYoutubeId(msg.text.replace(/\n/g, ' '))
  if (youtubeVideoId) {
    return {
      video: `https://www.youtube.com/embed/${youtubeVideoId}?rel=0&autoplay=0&showinfo=0&controls=0`,
      isEmbedVideo: true,
    }
  }

  const vimeoVideoId = getVimeoId(msg.text.replace(/\n/g, ' '))
  if (vimeoVideoId) {
    return {
      video: vimeoVideoId,
      isEmbedVideo: true,
      isVimeo: true,
    }
  }

  return {}
}
// embed image
const regExpImageUrl = /^.*(https?\:\/\/\S+).*/
const getImageUrl = (text: string) => {
  const match = text.match(regExpImageUrl)
  if (match) {
    return match[1]
  }
  return null
}

const transformMessageImage = (msg: MessageDtoType): Partial<ChatMessage> => {
  if (
    msg.mediaResource &&
    (msg.mediaResource.mimeType.startsWith('image') ||
      msg.mediaResource.mimeType === 'application/pdf')
  ) {
    return { image: msg.mediaResource.originalUrl }
  }
  const image = getImageUrl(msg.text.replace(/\n/g, ''))
  if (image) {
    return {
      image,
      isEmbedImage: true,
    }
  }
  return {}
}

export const transformMessage = (
  users: { [key: string]: UserDtoType },
  msg: MessageDtoType,
): ChatMessage => ({
  _id: msg.uuid || msg.id || '',
  text: cleanTextChat(msg.text),
  createdAt: transformDateIfNeeded(msg.postedAt),
  user: {
    _id: msg.userRef,
    avatar: users[msg.userRef] && users[msg.userRef].avatarPicture,
    name: users[msg.userRef] && toString.person(users[msg.userRef]),
  },
  sequenceNo: msg.sequenceNo,
  meta: msg.meta,
  mediaResource: msg.mediaResource,
  ...transformMessageImage(msg),
  ...transformMessageVideo(msg),
  system: isMetaMessage(msg),
  quickReplies: isQuickReply(msg) ? transformQuickReply(msg.meta) : undefined,
})

export const curriedTransformMessage = curry(transformMessage)

const preventMinusOneSequenceNo = (msg: MessageDtoType) =>
  msg.sequenceNo === -1 ? Infinity : msg.sequenceNo

// Utils to transform array of messages
export const transformMessagesMap = (
  users: { [key: string]: UserDtoType },
  messages: MessageDtoType[],
) =>
  messages
    .sort(
      (a: MessageDtoType, b: MessageDtoType) =>
        preventMinusOneSequenceNo(b) - preventMinusOneSequenceNo(a),
    )
    .reduce(
      (
        previousValue: MessageDtoType[],
        currentValue: MessageDtoType,
        currentIndex: number,
        originalMessages: MessageDtoType[],
      ) => {
        if (isQuickReply(currentValue)) {
          const { uuid: currentUuid } = currentValue
          const nextMessages = originalMessages.slice(0, currentIndex)
          const isReplied = nextMessages.some(isAnswers(currentUuid))
          const isLastOne = !nextMessages.some(isQuickReply)

          return [
            ...previousValue,
            {
              ...currentValue,
              meta: {
                ...currentValue.meta,
                isLastOne,
                isReplied,
              },
            },
          ]
        }
        return [...previousValue, currentValue]
      },
      [],
    )
    .map(curriedTransformMessage(users))

export const optsRedirect = (url: string) => ({
  url,
  method: 'get',
})

const getLocationFromHeader = (response: any) => response.request.responseURL

export const fetchForceGetRedirectAsync = (url: string) =>
  pipe(
    optsRedirect,
    runAuthRequestAsync,
    logAsync,
    then(getLocationFromHeader),
    catchP(throwApiError),
  )(url)
