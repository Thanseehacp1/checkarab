import {StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import React from 'react';
import {ArrowLeft} from 'iconsax-react-native';
import SearchComponent from './SearchComponent';
import {useNavigation} from '@react-navigation/native';

export default function Header({title, back, search, horizontal}) {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {backgroundColor: 'white'}]}>
      {!back && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.leftContainer, {marginLeft: horizontal}]}>
          <ArrowLeft size="26" color="#000000" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {!search && <SearchComponent />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
        paddingVertical: 50,

        alignItems: 'center',
        justifyContent: 'space-between',
      },
      android: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    }),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginLeft: 10,
  },
});
