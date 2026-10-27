import {Button, StyleSheet, Text, View, Image, Platform} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {CloseCircle} from 'iconsax-react-native';
import ButtonSmall from '../postAuthComponents/ButtonSmall';
import {useTheme} from 'react-native-paper';
import {useNavigation,useRoute} from '@react-navigation/native';
import {useMutation, useQuery} from '@apollo/client';
import {GET_ORDER_DETAILS} from '../../graphQl/queries/Queries';
export default function Successful({ isVisible, onClose, message,orderId }) {
  const navigation = useNavigation();
  const route = useRoute();
 // const { orderId } = route.params || {};
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
 {/*} const handlePress = () => {
    setVisible(!visible);
  };*/}
  const { loading, error, data } = useQuery(GET_ORDER_DETAILS, {
    variables: { input: {
      orderId:orderId
    }  },
    fetchPolicy: "network-only"
  });
  //console.log("orederdata%%%%%",data);
  //console.log("orederid",orderId);
  const handleNavigation = () => {
    navigation.navigate('Orders');
  };
  const order = data?.getUserOrderDetailsInMobile;
 // console.log("##########",order);
  return (
    <View style={{flex: 1}}>
     {/*} <Button title="test" onPress={onClose} />*/}
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
              source={require('../../assets/images/tick2.png')}
              style={styles.img}
            />
          </View>
          <Text style={styles.successTxt}>
            Your Order Was Successfully Placed
          </Text>
          <Text style={styles.messageTxt}>{message}
            {/*You’ll receive an email at elisha2018@gmail.com once your order is
            confirmed{' '}*/}
          </Text>
          <View style={styles.buttonContainer}>
            <ButtonSmall
              title="Continue Shopping "
              width={'47%'}
              textColor={colors.primary}
              backgroundColor={colors.secondary}
              maxHeight={51}
              fontSize={12}
              onPress={onClose}
            />
            <ButtonSmall
              title="View Order"
              width={'47%'}
              textColor={colors.secondary}
              backgroundColor={colors.primary}
              maxHeight={48}
              fontSize={12}
              onPress={handleNavigation}
            />
          </View>
          <View style={styles.shadowStyle} />
          <Text style={styles.deliverTxt}>Deliver to</Text>
          <View style={styles.delivConatiner}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/images/locationb.png')}
                style={styles.locImag}
              />
            </View>
            <View>
              <Text style={styles.nameTxt}>{order?.shippingAddress?.firstname}</Text>
              <Text style={[styles.addrTxt,{padding:0}]}>
               {order?.shippingAddress?.address}
              </Text>
              <Text style={styles.addrTxt}>+971 {order?.shippingAddress?.mobile}</Text>
            </View>
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
    backgroundColor: '#2BB673',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  delivConatiner: {
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'fff',
    borderWidth:1,
    borderColor:"lightgrey"

   
  },
  iconContainer: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locImag: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
  addrTxt: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  nameTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#000000',
  },
  messageTxt: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 20,
    lineHeight: 15,
  },
  successTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1B1B1B',
    textAlign: 'center',
    marginVertical: 14,
  },
  deliverTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1B1B1B',
    marginTop: 30,
    marginLeft: 15,
    marginBottom: 18,
  },
  shadowStyle: {
    height: 0.5,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
