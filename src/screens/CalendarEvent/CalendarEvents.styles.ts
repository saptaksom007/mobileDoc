import { StyleSheet } from 'react-native'

import { Layout } from 'constants/Layout'
import { Color } from 'constants/Color'

export const ICON_SIZE_SMALL: number = Layout.window.height * 0.03
export const ICON_SIZE: number = Layout.window.height * 0.05
export const ICON_SIZE_LARGE: number = Layout.window.height * 0.09
export const TITLE_SIZE: number = 17

export default StyleSheet.create({
  modal: {
    height: Layout.window.height,
    width: Layout.window.width,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  modalInnerContainer: {
    flex: 1,
    marginTop: 80,
    height: Layout.window.height - 80,
    width: Layout.window.width,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: Color.white,
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 24,
  },
  listView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  saveBtn: {
    backgroundColor: Color.blueD,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  fab: {
    elevation: 5,
    position: 'absolute',
    top: 18,
    left: 24,
    height: 60,
    width: 60,
    backgroundColor: Color.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      width: StyleSheet.hairlineWidth,
      height: StyleSheet.hairlineWidth,
    },
  },
  scrollView: {
    padding: 18,
  },
  padder: {
    padding: 12,
  },
  flex: {
    flex: 1,
  },
  textBtn: {
    paddingVertical: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  textBtnActive: {
    borderBottomColor: Color.blue,
    borderBottomWidth: 4,
  },
  eventHeader: {
    marginTop: -8,
    height: 60,
  },
  badgeView: { position: 'absolute', top: 0, right: 0 },
  emptyData: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyTextTitle: {
    fontWeight: '400',
    fontSize: 24,
  },
  img: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Color.borderColor,
    marginVertical: 4,
  },
})
