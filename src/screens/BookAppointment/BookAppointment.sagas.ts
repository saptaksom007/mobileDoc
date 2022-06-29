import { put, takeLatest, select } from 'redux-saga/effects'
import { pipe, propOr, prop, pathOr } from 'ramda'
import i18n from 'ex-react-native-i18n'
import moment from 'moment'

import ConversationsListActions from 'screens/ConversationsList/ConversationsList.actions'
import { Actions as NavAction } from 'navigation/SagaNavigation'
import toString from 'common-docdok/lib/utils/toString'
import Actions, { ActionTypes } from './BookAppointment.actions'
import { UserDtoType } from 'common-docdok/lib/types'

const getConversationById = (
  { messaging: { conversations } }: any,
  conversationId: any,
) => pipe(propOr({}, conversationId))(conversations)

const getDoctorNameById = ({ userCache: { users } }: any, doctorId: any) =>
  pipe<{ [key: string]: UserDtoType }, UserDtoType, string>(
    prop(doctorId),
    (u: UserDtoType) => toString.person(u),
  )(users)

const getOption = (state: any, key: any) =>
  pipe(pathOr('', ['bookappointment', key]), k =>
    i18n.t(`bookappointment.message.${k}`),
  )(state)

const getReasonForAppointment = pathOr('', [
  'bookappointment',
  'reasonForAppointment',
])

const getOtherDoctor = pathOr('', ['bookappointment', 'otherDoctor'])

const getChatText = ({ date, day, time, doctor, reasonForAppointment }: any) =>
  i18n.t(
    `bookappointment.message.content${
      reasonForAppointment ? 'WithReason' : ''
    }`,
    {
      date,
      day,
      time,
      doctor,
      reasonForAppointment,
    },
  )

const isAnyDoctorSelected = ({ bookappointment: { preferredDoctor } }: any) =>
  preferredDoctor === 0

function* navigateToBookAppointment({
  payload: { conversationId, clinicId, scheduleAppointment },
}: any) {
  yield put(
    NavAction.push('bookappointment', {
      conversationId,
      clinicId,
      scheduleAppointment,
    }),
  )
}

function* navigateToChat({ payload: { doctorId, conversationId } }: any) {
  const conversation = yield select(getConversationById, conversationId)
  const isAnyDoctor = yield select(isAnyDoctorSelected)
  const doctorSelected = yield select(getDoctorNameById, doctorId)
  const doctor = isAnyDoctor
    ? i18n.t('bookappointment.message.anyDoctor')
    : doctorSelected
  const otherDoctor = yield select(getOtherDoctor)
  const date = yield select(getOption, 'preferredDate')
  const day = yield select(getOption, 'preferredDayOfWeek')
  const time = yield select(getOption, 'preferredTimeOfDay')
  const reasonForAppointment = yield select(getReasonForAppointment)
  yield put(
    ConversationsListActions.gotoChatRequested(
      Number(conversation.id),
      getChatText({
        doctor: doctor || otherDoctor,
        date,
        day,
        time,
        reasonForAppointment,
      }),
    ),
  )
}

function* selectOption({
  payload: { preferredDate, preferredDayOfWeek },
}: any) {
  if (preferredDate && preferredDate === 'urgent') {
    yield put(
      NavAction.showLocalWarning(i18n.t('bookappointment.urgentWarning')),
    )
  }

  const numOfDay = yield select(
    pathOr(0, ['bookappointment', 'preferredDayOfWeek']),
  )
  const preferredDateState = yield select(
    pathOr(0, ['bookappointment', 'preferredDate']),
  )
  const dayOfWeek = moment().day()
  if (
    (preferredDayOfWeek &&
      preferredDayOfWeek <= dayOfWeek &&
      preferredDateState === 'thisWeek') ||
    (preferredDate &&
      preferredDate === 'thisWeek' &&
      numOfDay > 0 &&
      numOfDay <= dayOfWeek)
  ) {
    yield put(
      Actions.selectOption({
        preferredDate: 'withinTwoWeeks',
      }),
    )
  }
}

export default [
  takeLatest(ActionTypes.NAVIGATE_TO_CHAT, navigateToChat),
  takeLatest(
    ActionTypes.NAVIGATE_TO_BOOKAPPOINTMENT,
    navigateToBookAppointment,
  ),
  takeLatest(ActionTypes.SELECT_BOOK_APPOINTMENT_OPTION, selectOption),
]
