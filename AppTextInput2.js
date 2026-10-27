import {Platform, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

export default function AppTextInput2({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  numberOfLines,
}) {
  const {colors} = useTheme();

  return (
    <View style={[styles.inputcontainer, {borderColor: colors.inputborder}]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{marginLeft: 10}}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputcontainer: {
    width: '100%',
    borderWidth: 1,
    ...Platform.select({ios:{
      paddingVertical:15
    }})
  },
});
