import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SearchNormal1} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function SearchComponent({mright}) {
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
      <View
        style={[
          styles.searchContainer,
          {backgroundColor: colors.lightbg, marginRight: mright ? 0 : 10},
        ]}>
        <SearchNormal1 size="20" color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
