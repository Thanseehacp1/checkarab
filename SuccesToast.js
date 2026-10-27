import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {TickCircle} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';

const SuccesToast = ({visible, message, onClose}) => {
  const {colors} = useTheme();
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      useNativeDriver={false}
      style={styles.modalContainer}
      hasBackdrop={false}>
      <View style={styles.modalContent}>
        <TickCircle size={30} color={colors.secondary} variant="Bold" />
        <Text style={styles.modalText} numberOfLines={1}>
          {message}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 80,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#44961D',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 5,
    justifyContent: "flex-start"
  },
  modalText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 14,
  },
});

export default SuccesToast;
