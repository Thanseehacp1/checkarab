import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function NavigationRow({
  catSelected,
  category,
  subcategory,
  subCat,
  brand,
  variant,
  brandSelected,
  variantSelected,
  containerStyle,
  prodListing,
  prodListingSelected,
  prod,
  prodSelected,
}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('Home', {screen: 'HomeScreen'});
  };

  const handleFirstNavigation = () => {
    if (!subcategory || !subcategory.length === 0) {
      // If category or subcategory is null, navigate directly to the Brand screen
      navigation.navigate('BrandsScreen', { brand });
     }else if (subcategory  && brand && prodListing && prod) {
      navigation.pop(5);
    } else if (subcategory  && brand && prodListing) {
      navigation.pop(4);
    } else if (subcategory  && brand) {
      navigation.pop(3);
   
    } else if (subcategory) {
      navigation.goBack();
    }
  };

{/* const handleSecondNavigation = () => {
    if (variant && brand && prodListing && prod) {
      navigation.pop(4);
    } else if (variant && brand && prodListing) {
      navigation.pop(3);
    } else if (variant && brand) {
      navigation.pop(2);
    } else if (variant) {
      navigation.goBack();
    }
  };*/}
  const handleThirdNavigation = () => {
    if (brand && prodListing && prod) {
      navigation.pop(3);
    } else if (brand && prodListing) {
      navigation.pop(2);
    } else if (brand) {
      navigation.goBack();
    }
  };
  const handleFourthNavigation = () => {
    if (prodListing && prod) {
      navigation.pop(2);
    } else if (prodListing) {
      navigation.goBack();
    }
  };
  const handleFifthNavigation = () => {
    if (prod) navigation.goBack();
  };

  return (
    <View style={[styles.maincontainer, containerStyle]}>
      <TouchableOpacity onPress={handleHomePress}>
        <View
          style={[styles.circleContainer, {backgroundColor: colors.lightbg}]}>
          <Icon name="home" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {category && (
          <TouchableOpacity
            onPress={handleFirstNavigation}
            style={[
              styles.navigation,
              {
                backgroundColor: catSelected
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: catSelected
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {category}
            </Text>
          </TouchableOpacity>
        )}
        {subcategory && (
          <TouchableOpacity
            onPress={handleThirdNavigation}
            style={[
              styles.navigation,
              {
                backgroundColor: subCat
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: subCat
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {subcategory}
            </Text>
          </TouchableOpacity>
        )}

      {/*  {variant && (
          <TouchableOpacity
            onPress={handleThirdNavigation}
            style={[
              styles.navigation,
              {
                backgroundColor: variantSelected
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Montserrat-Medium',
                fontSize: 12,
                color: variantSelected
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {variant}
            </Text>
          </TouchableOpacity>
        )}*/}

        {brand && (
          <TouchableOpacity
            onPress={handleFourthNavigation}
            style={[
              styles.navigation,
              {
                backgroundColor: brandSelected
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: brandSelected
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {brand}
            </Text>
          </TouchableOpacity>
        )}
        {prodListing && (
          <TouchableOpacity
            onPress={handleFifthNavigation}
            style={[
              styles.navigation,
              {
                backgroundColor: prodListingSelected
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: prodListingSelected
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {prodListing}
            </Text>
          </TouchableOpacity>
        )}

        {prod && (
          <TouchableOpacity
            style={[
              styles.navigation,
              {
                backgroundColor: prodSelected
                  ? colors.primary // Set the active background color
                  : colors.lightbg, // Set the default background color
              },
            ]}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: prodSelected
                  ? 'white' // Set the active font color
                  : colors.primary, // Set the default font color
              }}>
              {prod}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  navigation: {
    paddingVertical: 10,
    borderRadius: 40,
    paddingHorizontal: 20,
    marginRight: 15,
  },
  maincontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
