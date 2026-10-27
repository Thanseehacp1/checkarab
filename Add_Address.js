import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTheme} from 'react-native-paper';
import AppTextInput from '../../../../components/postAuthComponents/AppTextInput';
import AppButton from '../../../../components/preAuthComponents/AppButton';
import NavigationComponent from '../../../../components/postAuthComponents/NavigationComponent';
import AppTextInput2 from '../../../../components/postAuthComponents/AppTextInput2';
import Header from '../../../../components/postAuthComponents/Header';
import SuccesToast from '../../../../components/productComponents/SuccesToast';
import {
  GET_SHIPPING_ADDRESSES,
  GET_LOCATION,
} from '../../../../graphQl/queries/Queries';
import {useMutation, useQuery} from '@apollo/client';
import {
  SHIPPING_ADDRESS,
  UPDATE_SHIPPING,
} from '../../../../graphQl/mutations/mutations';
import DropdownPicker from 'react-native-dropdown-picker';
export default function Add_Address({navigation, route}) {
  const {colors} = useTheme();
  const {control, handleSubmit, setValue, formState} = useForm();
  const {errors} = formState;
  const [category, setCategory] = useState('');
  const [governoratesOpen, setGovernoratesOpen] = useState(false);
  const [governorates, setGovernorates] = useState([]);
  const [villages, setVillages] = useState([]);
  const [governorateName, setGovernorateName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [villagesOpen, setVillagesOpen] = useState(false);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(!!route?.params?.editAddress);
  const editAddress = route?.params?.editAddress || null;
  const [modal, setmodal] = useState(false);
  const {data, refetch} = useQuery(GET_SHIPPING_ADDRESSES);
  const [createShippingAddress, {loading: isCreatingLoading}] =
    useMutation(SHIPPING_ADDRESS);
  const [updateShippingAddress, {loading: isUpdatingLoading}] =
    useMutation(UPDATE_SHIPPING);
  const {
    data: getLocation,
    loading: getLocationLoading,
    error: getLocationError,
  } = useQuery(GET_LOCATION);

  useEffect(() => {
    if (getLocation?.getLocationsData) {
      const governorateData = getLocation.getLocationsData.map(item => ({
        label: item.name,
        value: item._id,
        villages: item.villages,
      }));
      setGovernorates(governorateData);
    }
  }, [getLocation]);

  const handleGovernorateChange = item => {
    setGovernorateName(item?.label);
    setSelectedGovernorate(item.value);
    setVillages(item?.villages || []);
    setSelectedVillage(null);
    setVillageName('');

    setValue('governorate', item.label);
    setValue('governorateID', item.value);
  };

  useEffect(() => {
    if (isEditMode && editAddress) {
      setValue('firstname', editAddress.firstname);
      setValue('country', editAddress.country);
      setValue('address', editAddress.address);
      // setValue('houseNumber', editAddress.houseNumber);
      //setValue('apartment', editAddress.apartment);
      setValue('label', editAddress.label);
      setValue('governorate', editAddress.governorate);
      setValue('village', editAddress.village);
      setValue('postCode', editAddress.postCode);
      setValue('mobile', editAddress.mobile);
      setValue('email', editAddress.email);

      setValue('governorateID', editAddress.governorate);
      setValue('villageID', editAddress.village);
    }
  }, [isEditMode, editAddress, setValue]);
  const onSubmitHandler = async formData => {
    try {
      /* {
    "villageID": null,
    "village": null,
    "postCode": null,
    "mobile": null,
    "label": null,
    "isDefault": null,
    "governorateID": null,
    "governorate": null,
    "firstname": null,
    "email": null,
    "country": null,
    "address": null
  } */
      let input = {
        firstname: formData.firstname,
        country: formData.country,

        //houseNumber: formData.houseNumber || "",

        address: formData.address,
        label: formData.label,
        governorate: formData.governorate,
        village: formData.village,
        postCode: formData.postCode,
        mobile: formData.mobile,
        email: formData.email,
        // isDefault: false,
        //apartment: formData.apartment || "",
        governorateID: formData.governorateID,
        villageID: formData.villageID,
      };
      console.log('Input data being sent:', input);

      if (isEditMode) {
        if (editAddress && editAddress._id) {
          const response = await updateShippingAddress({
            variables: {
              input: {
                ...input,
                _id: editAddress._id,
              },
            },
          });
          console.log('Update response:', response);
        } else {
          console.error('No valid _id found for editing.');
        }
      } else {
        input = {...input, isDefault: false};
        const response = await createShippingAddress({
          variables: {
            input: {
              ...input,
            },
          },
        });
        console.log('Create response:', response);
      }

      refetch(); // Refresh the list of addresses

      navigation.goBack(); // Navigate back to the address list
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };
  useEffect(() => {
    console.log('selectedgov', selectedGovernorate);
    console.log('selectedvil', selectedVillage);
    console.log('namegov', governorateName);
    console.log('namevill', villageName);
    //  console.log("namevill",villageName);
  }, [selectedVillage, selectedGovernorate]);
  return (
    <ScrollView
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}
      contentContainerStyle={{paddingHorizontal: 10}}>
      <Header title={'Add Address'} search={true} />
      <View style={{height: 10}} />
      <NavigationComponent title="Add Address" selected={true} />

      <View style={{height: 20}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Label <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="label"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder="Home / Office "
            onChangeText={field.onChange}
            value={field.value}
            numberOfLines={2}
          />
        )}
        rules={{required: 'Label is required'}}
      />
      {errors.label && (
        <Text style={{color: 'red'}}>{errors.label.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Full name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="firstname"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder="Enter Your name"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'First name is required'}}
      />
      {errors.firstname && (
        <Text style={{color: 'red'}}>{errors.firstname.message}</Text>
      )}

      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Country / Region <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="country"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder="Country / Region"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Country is required'}}
      />
      {errors.country && (
        <Text style={{color: 'red'}}>{errors.country.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Governorate <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>

      <DropdownPicker
        scrollEnabled={true}
        listMode="SCROLLVIEW"
        open={governoratesOpen}
        value={selectedGovernorate}
        items={governorates}
        setOpen={setGovernoratesOpen}
        setValue={setSelectedGovernorate}
        onSelectItem={value => {
          console.log('values', value);

          handleGovernorateChange(value);
        }}
        placeholder="Select Governorate"
        placeholderStyle={{
          fontSize: 14,
          color: 'grey',
        }}
        style={[
          styles.inputcontainer,
          {
            borderColor: colors.inputborder,
            //marginVertical: 10,
            zIndex: 1000,
          },
        ]}
      />

      {errors.governorateID && (
        <Text style={{color: 'red'}}>{errors.governorateID.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Wilayat <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>

      <DropdownPicker
        scrollEnabled={true}
        listMode="SCROLLVIEW"
        open={villagesOpen}
        value={selectedVillage}
        items={villages.map(village => ({
          label: village.name,
          value: village._id,
        }))}
        setOpen={setVillagesOpen}
        setValue={setSelectedVillage}
        onSelectItem={value => {
          setVillageName(value?.label);
          setSelectedVillage(value?.value);
          setValue('village', value?.label);
          setValue('villageID', value?.value);
        }}
        placeholder="Select Wilayat"
        style={[
          styles.inputcontainer,
          {borderColor: colors.inputborder, zIndex: 1000},
        ]}
        placeholderStyle={{
          fontSize: 14,

          color: 'grey',
        }}
        disabled={villages.length === 0}
      />

      {errors.villageID && (
        <Text style={{color: 'red'}}>{errors.villageID.message}</Text>
      )}
      <Text style={[styles.txt, {color: colors.primary}]}>
        Address <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="address"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder="Enter Your Address "
            onChangeText={field.onChange}
            value={field.value}
            numberOfLines={2}
          />
        )}
        rules={{required: 'Address is required'}}
      />
      {errors.address && (
        <Text style={{color: 'red'}}>{errors.address.message}</Text>
      )}

      {/*} <View style={{ height: 20 }} />


      {/* <View style={{height: 20}} /> */}
      {/* 

      <Controller
        name="houseNumber"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <AppTextInput
            placeholder="House number "
            onChangeText={field.onChange}
            value={field.value}
            numberOfLines={2}
          />
        )}
        rules={{ required: 'House Number is required' }}
      />
      {errors.houseNumber && (
        <Text style={{ color: 'red' }}>{errors.houseNumber.message}</Text>
      )} */}
      {/*}<View style={{ height: 20 }} />
     <Controller
        name="apartment"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <AppTextInput
            placeholder="Apartment, suite, unit, etc. (optional) "
            onChangeText={field.onChange}
            value={field.value}
            numberOfLines={2}
          />
        )}

      />
      <View style={{ height: 10 }} />

      <View style={{ height: 10 }} />*/}

      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Pincode/Zip <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="postCode"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
            keyboardType="numeric"
          />
        )}
        rules={{
          required: ' Postcode is required',
          pattern: {
            value: /^[0-9]{5,6}$/,
            message: 'Enter a valid postcode',
          },
        }}
      />
      {errors.postCode && (
        <Text style={{color: 'red'}}>{errors.postCode.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Phone <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="mobile"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder="Enter Your Phone number"
            onChangeText={field.onChange}
            value={field.value}
            keyboardType="phone-pad"
          />
        )}
        rules={{
          required: ' Phone nunber is required',
          pattern: {value: /^[0-9]{8}$/, message: 'Enter a valid phone number'},
        }}
      />
      {errors.mobile && (
        <Text style={{color: 'red'}}>{errors.mobile.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>
        Email <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
            type="text"
          />
        )}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
          },
        }}
      />
      {errors.email && (
        <Text style={{color: 'red'}}>{errors.email.message}</Text>
      )}
      <View style={{height: 30}} />
      <AppButton
        title="Submit"
        onPress={handleSubmit(onSubmitHandler)}
        containerColor={colors.primary}
        textColor={colors.secondary}
        fontSize={14}
        loading={isCreatingLoading || isUpdatingLoading}
      />
      <View style={{height: 10}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1},

  txt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginVertical: 10,
  },
  inputcontainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
    }),
  },
});
