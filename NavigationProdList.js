import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function NavigationProdDetails({title}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.maincontainer, {marginLeft: 10}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View
          style={[styles.circleContainer, {backgroundColor: colors.lightbg}]}>
          <Icon name="home" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.secondnavigation,
          {
            backgroundColor: colors.primary,
          },
        ]}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
            color: colors.secondary,
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
    padding: 7,
    marginRight: 15,
  },
  firstnavigation: {
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 15,
    paddingHorizontal: 20,
  },
  secondnavigation: {
    paddingVertical: 10,
    borderRadius: 40,
    paddingHorizontal: 20,
  },
  maincontainer: {flexDirection: 'row', alignItems: 'center'},
});
