import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';

export default function ButtonSmall({
  title,
  width,
  leftImage,
  textColor,
  backgroundColor,
  borderColor,
  onPress,
  fontSize,
  maxHeight,
}) {
  const buttonStyle = {
    width,
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    maxHeight: maxHeight,
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      {leftImage && <Image source={leftImage} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={[styles.title, {color: textColor, fontSize: fontSize}]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 9,
    borderWidth: 1,
    padding: 5,
    minHeight: 45,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Medium',
  },
  image: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
