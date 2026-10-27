import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import {useMutation, useQuery} from '@apollo/client';

import {CLOSE_ACCOUNT} from '../../../../graphQl/mutations/mutations';
import Header from '../../../../components/postAuthComponents/Header';
import {useForm, Controller} from 'react-hook-form';
import {clearTokenAndUser, setTokenAndUser} from '../../../../redux/authSlice';
import AppButton from '../../../../components/preAuthComponents/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme, Divider} from 'react-native-paper';
const {height, width} = Dimensions.get('window');
export default function CloseAccount({navigation}) {
  const {colors} = useTheme();
  const {token, user} = useSelector(state => state.auth) || '';
  const dispatch = useDispatch();
  const [closeAccount, {loading}] = useMutation(CLOSE_ACCOUNT);
  const [deletedReason, setDeletedReason] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    formState: {errors, isValid},
  } = useForm();

  const onSubmitHandler = async data => {
    try {
      const response = await closeAccount({
        variables: {
          input: {
            isDeleted: true,
            deleteReason: deletedReason,
          },
        },
      });
      if (response.data?.accountDeleteByUser?.success) {
        Alert.alert('Success', response.data.accountDeleteByUser.message, [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearTokenAndUser());
              navigation.navigate('HomeScreen');
            },
          },
        ]);
      } else {
        Alert.alert(
          'Error',
          response.data?.accountDeleteByUser?.message || 'Something went wrong',
        );
      }
    } catch (error) {
      console.error('Delete Account Error:', error);
      Alert.alert('Error', 'Failed to close the account. Please try again.');
    }
  };

  return (
    <View style={[styles.mainContainer, {backgroundColor: colors.secondary}]}>
      <Header title={'Delete Account'} search={true} />
      <Divider style={{marginVertical: 5}} />
      <View>
        {/* <Text style={[styles.tabText]}>Description</Text>*/}
        <Text style={[styles.contentTxt]}>
          Are you sure you want to delete your account? This action is
          irreversible and will permanently remove your profile, order history,
          and saved preferences.If you're facing issues, consider reaching out
          to our support team before proceeding. Otherwise, click Submit to
          delete your account.
        </Text>
      </View>

      {/*<Text style={[styles.tabText]}>Feed Back</Text>*/}
      <Text
        style={[{fontFamily: 'Poppins-Regular', padding: 0, marginLeft: 16}]}>
        Share your haptic feedback about us
      </Text>
      <Controller
        control={control}
        name="Details"
        rules={{required: 'This field is required'}}
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            multiline
            value={value}
            placeholder=""
            onChangeText={text => {
              onChange(text);
              setDeletedReason(text);
            }}
            onBlur={onBlur}
            style={{
              borderColor: '#EAEAEA',
              borderWidth: 1,
              minHeight: 250,
              width: '95%',
              marginTop: 10,
              borderRadius: 5,
              marginLeft: 10,
              padding: 10,
              textAlignVertical: 'top',
            }}
            returnKeyType={'done'}
          />
        )}
      />
      {errors.Details && (
        <Text style={{color: 'red', margin: 5}}> {errors.Details.message}</Text>
      )}
      {/*} <Text style={{ marginTop: 10 }}>Important Notice: Once you close your account, you will lose access to it permanently.
        </Text>*/}

      <View style={{flex: 1}} />
      <AppButton
        title="Submit"
        onPress={handleSubmit(onSubmitHandler)}
        containerColor={colors.primary}
        textColor={colors.secondary}
        fontSize={14}
      />
      <View style={{height: 20}} />
    </View>
  );
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
    color: 'black',
    marginBottom: 30,
    paddingTop: 10,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    color: 'black',
    paddingHorizontal: 10,
  },
  inputcontainer: {
    width: '100%',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        paddingVertical: 15,
      },
    }),
  },
});
