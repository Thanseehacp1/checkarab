import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {CloseCircle, SearchNormal1} from 'iconsax-react-native';

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  rightIcon,
  editable,
  width,
  onKeyPress,
  customContainerStyles,
   onClear,
  onButtonPress,
  placeholderTextColor
}) {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.inputcontainer,
        {backgroundColor: colors.bglight, width: width},
        customContainerStyles,
      ]}>
      <SearchNormal1
        size="20"
        color={colors.primary}
        style={{marginHorizontal: 7,marginBottom:5}}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{flex: 1, fontFamily: 'Poppins-Regular'}}
        editable={editable}
        onKeyPress={onKeyPress}
        placeholderTextColor={placeholderTextColor}
        onSubmitEditing={onButtonPress}

      />
      {rightIcon && (
        <TouchableOpacity onPress={onClear}>
          <CloseCircle
            size="20"
            color="#9E9E9E"
            variant="Bold"
            style={{marginRight: 8}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputcontainer: {
    ...Platform.select({
      ios: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        borderRadius: 10,
      },
      android: {
        flexDirection: 'row',
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 5,
      },
    }),
  },
});
