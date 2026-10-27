import React , {useState} from 'react'
import { View, Text,  StyleSheet, Dimensions,Alert, TextInput,Platform,ScrollView } from 'react-native'
import { useMutation, useQuery } from '@apollo/client';

//import { CLOSE_ACCOUNT } from '../../../../graphQl/mutations/mutations';
import Header from '../postAuthComponents/Header';
import { useForm, Controller, } from 'react-hook-form'
import AppButton from '../preAuthComponents/AppButton';
import ButtonSmall from '../postAuthComponents/ButtonSmall';
import {useTheme,Divider} from 'react-native-paper';
const {height, width} = Dimensions.get('window');
import {GET_WARRANTY_POLICY}  from '../../graphQl/queries/Queries';
export default function WarrantyPolicy({navigation,route}) {
const orderId = route?.params?.orderId; // Safe extraction
const productId =route?.params?.productId;
console.log("productttttt",productId);
  const {colors} = useTheme();
   const [policyText, setPolicyText] = useState("");
    const { data, loading, error } = useQuery(GET_WARRANTY_POLICY, {
    skip: !orderId,
       variables: {
       input:{
       orderProductId : orderId,
       } },
     });

      const { name, description, duration, warrantyRegister, warrantyType } = data?.getWarrantyPolicyOfOrderProductInMobile || {};

  return (
     <View style={[styles.mainContainer, {backgroundColor: colors.secondary}]}>
          <Header title={'Warranty Policy'} search={true}/>
          <Divider style={{marginVertical: 5}} />
          <ScrollView>
           <View style={{ flex: 1 }}>
              <Text style={[styles.tabText]}>{name || "Warranty Policy"}</Text>
               <Text style={[styles.contentTxt]}>
                  {description || "No warranty details available."}
                   </Text>

 {/*<Text style={styles.contentTxt}>Duration: {duration || "N/A"} days</Text>
        <Text style={styles.contentTxt}>Type: {warrantyType || "N/A"}</Text>
         <Text style={[styles.contentTxt]}>Register Warranty: {warrantyRegister ? "Yes" : "No"}</Text>*/}

  <Text style={[styles.contentTxt]}>know more about  <Text style={styles.redText}>PRIVACY & POLICY</Text></Text>

</View>
</ScrollView>
 <View style={{ height: 20 }} />
          <View style={styles.buttonContainer}>
           <ButtonSmall
                                     title="Cancel "
                                     width={ '48%'}
                                     textColor={ colors.primary}
                                     backgroundColor={ colors.secondary}
                                     maxHeight={51}
                                     fontSize={12}
                                      style={{ padding: 5 }}
                                       onPress={() => navigation.goBack()}
                                     />
               <ButtonSmall
                 title="Accept"
                   width={ '48%'}
               onPress={() => navigation.navigate('WarrantyOrder', { orderId,productId,warrantyType})}
                  backgroundColor={ colors.primary}
                 textColor={colors.secondary}
                 fontSize={14}
                 maxHeight={51}
                  style={{ padding: 5 }}
               />

</View>

               <View style={{ height: 20 }} />


 </View>


  )
  }
  const styles = StyleSheet.create({
      mainContainer: {paddingHorizontal: 7, flex: 1},
      singleItem: {
       width: '100%', // Adjust to take full width for single items
     },
    txt: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      marginVertical: 10,
    },
    contentTxt: {
      paddingHorizontal: 20,
      fontFamily: 'Poppins-Regular',
      fontSize: height * 0.016,
      //color: '#414141',
      color:"black",
      marginBottom: 10,
      paddingTop: 10,
    },
    tabText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 17,
      color:"black",
      paddingHorizontal: 10,
    },
     redText: {
       color:"black",
              fontSize: 12,
              fontFamily: 'Poppins-Bold',
      },
    inputcontainer: {
      width: '100%',
      borderWidth: 1,
      ...Platform.select({
        ios: {
          paddingVertical: 15
        }
      })
    },
     buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10 // Add some space from the bottom
      },
  });
