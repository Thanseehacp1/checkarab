import {Platform, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

export default function AppTextInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  numberOfLines,
  borderRadius,
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
    width: '97%',
    borderWidth: 1,
    borderRadius: 5,
    ...Platform.select({ios:{
      paddingVertical:10
    }})
  },
});
