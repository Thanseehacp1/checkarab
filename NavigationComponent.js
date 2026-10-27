import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function NavigationComponent({selected, title, twist, left}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('Home', {screen: 'HomeScreen'});
  };
  const handleBackPress = () => {
    twist
      ? navigation.navigate('Home', {screen: 'ProfileScreen'})
      : navigation.goBack();
  };
  return (
    <View style={[styles.maincontainer, {marginLeft: left}]}>
      <TouchableOpacity onPress={handleHomePress}>
        <View
          style={[styles.circleContainer, {backgroundColor: colors.lightbg}]}>
          <Icon name="home" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleBackPress}
        style={[styles.firstnavigation, {backgroundColor: colors.lightbg}]}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 12,
            fontFamily: 'Poppins-Medium',
          }}>
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.secondnavigation,
          {
            backgroundColor: selected
              ? colors.primary // Set the active background color
              : colors.lightbg, // Set the default background color
          },
        ]}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
            color: selected
              ? 'white' // Set the active font color
              : colors.primary, // Set the default font color
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  firstnavigation: {
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 15,
    paddingHorizontal: 20,
  },
  secondnavigation: {
    paddingVertical: 10,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  maincontainer: {flexDirection: 'row', alignItems: 'center'},
});
