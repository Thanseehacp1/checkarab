import React from 'react';
import {Dimensions, Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import AppButton from '../preAuthComponents/AppButton';
import {useTheme} from 'react-native-paper';
import {BagHappy, BagTick} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
function AddToCart({
  isVisible,
  onBackdropPress,
  itemName,
  continueShopping,
  handleNavigation,
}) {
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            height: 240,
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 25,
          }}>
          <View style={[styles.rowContainer]}>
            <View style={[styles.circleContainer]}>
              <BagTick size={26} color={colors.secondary} variant="Bold" />
            </View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: 'space-between',
                paddingVertical: 2,
              }}>
              <Text style={[styles.nameTxt, {color: colors.primary}]}>
                {itemName && itemName?.length > 30
                  ? `${itemName?.substring(0, 30)}...`
                  : itemName}
              </Text>

              <Text style={[styles.nameTxt, {color: colors.offrclr}]}>
                Added to Cart
              </Text>
            </View>
          </View>
          <View style={{marginTop: 25}}>
            <AppButton
              title=" Continue Shopping"
              containerColor={colors.secondary}
              width={'100%'}
              borderColor={colors.grey}
              fontSize={14}
              textColor={colors.primary}
              onPress={continueShopping}
            />
            <View style={{height: 16}} />
            <AppButton
              title="View Cart"
              width={'100%'}
              containerColor={colors.primary}
              textColor={colors.secondary}
              fontSize={14}
              onPress={handleNavigation}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  circleContainer: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    backgroundColor: '#44961D',
    height: 50,
  },
  nameTxt: {
    fontSize: height * 0.02,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
});

export default AddToCart;
