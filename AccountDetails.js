import React, {useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTheme} from 'react-native-paper';
import AppTextInput from '../../../../components/postAuthComponents/AppTextInput';
import AppButton from '../../../../components/preAuthComponents/AppButton';
import NavigationComponent from '../../../../components/postAuthComponents/NavigationComponent';
import Header from '../../../../components/postAuthComponents/Header';
import SuccesToast from '../../../../components/productComponents/SuccesToast';
import {GET_USER} from '../../../../graphQl/queries/Queries';
import {useMutation, useQuery} from '@apollo/client';
import {useSelector} from 'react-redux';
import {UPDATE_USER} from '../../../../graphQl/mutations/mutations';
import {h} from '../../../../utils/PercentageToDp';
import {useCallback} from 'react';

const {width, height} = Dimensions.get('window');

export default function AccountDetails() {
  const {colors} = useTheme();
  const {control, handleSubmit, formState} = useForm();
  const {errors} = formState;
  const [modal, setmodal] = useState(false);
  const handleBackdropPress = () => {
    setmodal(false);
  };
  const {token, user} = useSelector(state => state.auth) || '';

  const [refreshing, setRefreshing] = useState(false);

  const {
    loading: isAccountDetailsLoading,
    error,
    data,
    refetch,
  } = useQuery(GET_USER, {
    variables: {
      input: {
        _id: user,
      },
    },
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);

  const [updateUser, {data: res, error: updateError, loading}] =
    useMutation(UPDATE_USER);

  const onSubmitHandler = async formData => {
    console.log('dataaaaaaa', formData);
    // console.log(data, 'jjjjjj');
    try {
      const res = await updateUser({
        variables: {
          input: formData,
          // _id: token.userId,
        },
      });
      if (res) {
        setmodal(true);
        await refetch();

        setTimeout(() => {
          setmodal(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isUserdataLoading = isAccountDetailsLoading || refreshing;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}
      contentContainerStyle={{paddingHorizontal: 10, flexGrow: 1}}>
      <Header title={'Account Details'} search={true} />
      {!isUserdataLoading && (
        <>
          <View style={{height: 10}} />
          <NavigationComponent title="Account Details" selected={true} />
          <View style={{height: 20}} />
          <Text style={[styles.txt, {color: '#737373'}]}>
            Full name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
          </Text>
          <Controller
            name="firstName"
            control={control}
            defaultValue={data?.getUserRecordInMobile?.record?.firstName}
            render={({field}) => (
              <AppTextInput
                placeholder=""
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
            rules={{required: 'First name is required'}}
          />
          {errors.firstName && (
            <Text style={{color: 'red'}}>{errors.firstName.message}</Text>
          )}
          <Text style={[styles.txt, {color: '#737373'}]}>
            Email <Text style={[styles.txt, {color: 'red'}]}>*</Text>
          </Text>
          <Controller
            control={control}
            name="email"
            defaultValue={data?.getUserRecordInMobile?.record?.email}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            }}
            render={({field}) => (
              <AppTextInput
                placeholder="Email Address"
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.email && (
            <Text style={{color: 'red'}}>{errors.email.message}</Text>
          )}

          <View style={{height: 20}} />
          <View style={{justifyContent: 'flex-end', flex: 1, marginBottom: 20}}>
            <AppButton
              title={'Save Changes'}
              loading={loading}
              onPress={handleSubmit(onSubmitHandler)}
              containerColor={colors.primary}
              textColor={colors.secondary}
            />
          </View>
          <SuccesToast
            visible={modal}
            message="User Updated Successfully!"
            onClose={() => setmodal(false)}
          />
        </>
      )}

      {isUserdataLoading && (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: h(130),
          }}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greytxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 20,
  },
  circleContainer: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    backgroundColor: '#44961D',
    height: 50,
  },
  mainContainer: {flex: 1},
  txt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginVertical: 15,
  },
  nameTxt: {
    fontSize: height * 0.02,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    //justifyContent: 'flex-start',
    padding: 5,
    width: '100%',
  },
  modalText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 14,
  },
});
