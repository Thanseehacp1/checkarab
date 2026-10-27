import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {CloseCircle} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';

const FailureToast = ({visible, message, onClose}) => {
  const {colors} = useTheme();
  //console.log("Toast Visibility:", visible);
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      useNativeDriver={false}
      style={styles.modalContainer}
      hasBackdrop={false}>
      <View style={styles.modalContent}>
        <CloseCircle
          size="30"
          color="#9E9E9E"
          variant="Bold"
          onPress={onClose}
        />
        <Text style={styles.modalText}>{message}</Text>
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
    backgroundColor: '#E30613',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 5,
  },
  modalText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
});

export default FailureToast;
