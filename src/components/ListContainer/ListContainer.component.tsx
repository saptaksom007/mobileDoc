import React, { PureComponent, ReactElement } from 'react'

import EmptyList from 'components/EmptyList/EmptyList.component'
import { View, FlatList, ListRenderItemInfo } from 'react-native'
import styles from './ListContainer.styles'

interface Props {
  data: any[]
  renderItem<T>(info: ListRenderItemInfo<T>): ReactElement<any> | null
  testID?: string
  extraData?: any
}

class ListContainer extends PureComponent<Props> {
  render() {
    const { data, testID, renderItem, extraData } = this.props
    if (!data || data.length === 0) {
      return <EmptyList show />
    }
    return (
      <View
        testID={testID}
        accessibilityLabel={testID}
        style={styles.container}
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          style={styles.list}
          keyExtractor={(_item: any, index: number) => `row-${index}`}
          extraData={extraData}
        />
      </View>
    )
  }
}

export default ListContainer
