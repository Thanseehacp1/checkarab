import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import AppButton from '../preAuthComponents/AppButton';
import {useTheme} from 'react-native-paper';

const {height, width} = Dimensions.get('window');
console.log(width, height);

const DetailsTabView = ({info,specification}) => {
  
  const {colors} = useTheme();
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [showFullSpecifications, setShowFullSpecifications] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  const renderTab = tabName => {
    return (
      <TouchableOpacity
        key={tabName}
        onPress={() => setSelectedTab(tabName)}
        style={[
          styles.tab,
          {
            borderBottomWidth: 2,
            borderBottomColor:
              selectedTab === tabName ? colors.tertiary : '#D9D9D9',
          },
        ]}>
        <Text
          style={[
            styles.tabText,
            {color: selectedTab === tabName ? colors.tertiary : colors.primary},
          ]}>
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {renderTab('Overview')}
        {renderTab('Specifications')}
      </View>

      {selectedTab === 'Overview' && (
        <View style={styles.tabContent}>
          <Text style={[styles.contentTxt]}> {showFullOverview ? info : info?.substring(0, 100) + '...'}</Text>
          {info && info?.length > 100 && (
          <AppButton
          title={showFullOverview ? 'View Less' : 'View More'}
          onPress={() => setShowFullOverview(!showFullOverview)}
            width={width * 0.85}
            borderColor={'#ADADAD'}
            textColor={'#000000'}
          />
        )}
        </View>
      )}

      {selectedTab === 'Specifications' && (
        <View style={styles.tabContent}>
        {showFullSpecifications ? (
    specification.map((item, index) => (
      <Text key={index} style={[styles.contentTxt]}>{item}</Text>
    ))
  ) : (
    <Text style={[styles.contentTxt]}>
      {specification.slice(0, 3).join(', ') + (specification.length > 3 ? '...' : '')}
    </Text>
  )}

  {specification.length > 3 && (
          <AppButton
            title={showFullSpecifications ? 'View Less' : 'View More'}
            onPress={() => setShowFullSpecifications(!showFullSpecifications)}
            width={width * 0.85}
            borderColor={'#ADADAD'}
            textColor={'#000000'}
          />
        )}

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    // ...Platform.select({
    //   android: {
    //     elevation: 5,
    //   },
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: 0,
    //       height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //   },
    // }),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tab: {
    paddingVertical: 20,
    alignItems: 'center',
    flex: 1,
  },

  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.02,
  },
  tabContent: {
    paddingTop: 15,
    alignItems: 'center',
  },
  contentTxt: {
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.017,
    color: '#414141',
   // marginBottom: 30,
    paddingTop: 10,
  },
});

export default DetailsTabView;
