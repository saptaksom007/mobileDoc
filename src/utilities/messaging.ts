import get from 'lodash/get'
import i18n from 'ex-react-native-i18n'
import { decodeText } from 'utilities/html'

export const getTitleConversation = (conv: any): any =>
  decodeText(get(conv, 'title', i18n.t('global.notitle')))
