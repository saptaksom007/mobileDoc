import { Color } from 'constants/Color'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventHeader: {
    marginTop: -8,
    height: 60,
  },
  padder: {
    padding: 12,
    marginBottom: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
})
