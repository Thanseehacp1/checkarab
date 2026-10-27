import {Button, StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {CloseCircle} from 'iconsax-react-native';
import ButtonSmall from '../postAuthComponents/ButtonSmall';
import {useTheme} from 'react-native-paper';

const {width, height} = Dimensions.get('window');
export default function Failure({ isVisible, onClose,orderId, message }) {
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const handlePress = () => {
    setVisible(!visible);
  };
  return (
    <View style={{flex: 1}}>
      {/*<Button title="test" onPress={handlePress} />*/}
      <Modal
        isVisible={isVisible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: 50,
          }}>
          <View style={[styles.header]}>
            <CloseCircle
              size="30"
              color="#9E9E9E"
              variant="Bold"
              onPress={onClose}
            />
          </View>
          <View style={styles.tickContainer}>
            <Image
              source={require('../../assets/images/cross.png')}
              style={styles.img}
            />
          </View>
          <Text style={styles.successTxt}>{message ? message: "Oops! Something Went Wrong"}</Text>
          <Text style={styles.messageTxt}>
            We are unable to process your order at this time
          </Text>
          <View style={{alignItems: 'center', marginTop: 22}}>
            <ButtonSmall
              title="Try Again"
              width={width * 0.5}
              textColor={colors.secondary}
              backgroundColor={colors.primary}
              maxHeight={48}
              fontSize={12}
              onPress={onClose}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    marginTop: 15,
    marginRight: 15,
  },
  tickContainer: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: '#F42020',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  img: {
    resizeMode: 'contain',
    width: 24,
    height: 17,
  },
  successTxt: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1B1B1B',
    textAlign: 'center',
    marginVertical: 14,
  },

  messageTxt: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 20,
    lineHeight: 15,
  },
});
