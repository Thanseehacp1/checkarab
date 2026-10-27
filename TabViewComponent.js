import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ProductsList from './ProductListing';

const CustomTabView = () => {
  const [selectedTab, setSelectedTab] = useState('Tab1');

  const renderTab = tabName => {
    return (
      <TouchableOpacity onPress={() => setSelectedTab(tabName)}>
        <Text
          style={[
            styles.tabText,
            {color: tabName === selectedTab ? 'red' : 'black'},
          ]}>
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {renderTab('Iphone')}
        {renderTab('MacBook')}
        {renderTab('Airpods')}
        {renderTab('Ipad')}
        {renderTab('Watch')}
      </View>

      {selectedTab === 'Iphone' && (
        <View style={styles.tabContent}>
          <ProductsList />
        </View>
      )}

      {selectedTab === 'MacBook' && (
        <View style={styles.tabContent}>
          <ProductsList />
          <ProductsList />
        </View>
      )}

      {selectedTab === 'Airpods' && (
        <View style={styles.tabContent}>
          <ProductsList />
        </View>
      )}

      {selectedTab === 'Ipad' && (
        <View style={styles.tabContent}>
          <ProductsList />
          <ProductsList />
        </View>
      )}

      {selectedTab === 'Watch' && (
        <View style={styles.tabContent}>
          <ProductsList />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {fontFamily: 'Poppins-Medium', fontSize: 13},
  tabContent: {
    paddingTop: 15,
  },
});

export default CustomTabView;
