import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTheme} from 'react-native-paper';
import AppTextInput from '../postAuthComponents/AppTextInput';
import AppButton from '../preAuthComponents/AppButton';
import NavigationComponent from '../postAuthComponents/NavigationComponent';
import AppTextInput2 from '../postAuthComponents/AppTextInput2';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SuccesToast from '../productComponents/SuccesToast';
import FailureToast from '../productComponents/FailureToast';
import {launchImageLibrary} from 'react-native-image-picker';
import Header from '../postAuthComponents/Header';
import {
  GET_SHIPPING_ADDRESSES,
  GET_LOCATION,
} from '../../graphQl/queries/Queries';
import {useMutation, useQuery} from '@apollo/client';
import {RETURN_ORDER} from '../../graphQl/mutations/mutations';
import DropdownPicker from 'react-native-dropdown-picker';

import RNFS from 'react-native-fs';
import {Readable} from 'stream';
import {filePaths} from '../../config/filePath';

import axios from 'axios';
import {verifyRequiredFields} from '../../utils/validation';
import {Camera} from 'iconsax-react-native';
import {instance} from '../../config/common.config';

export default function ReturnOrder({navigation, route}) {
  const orderId = route?.params?.orderId;
  console.log('orderId/////', orderId);
  const {colors} = useTheme();
  const {control, handleSubmit, setValue, formState} = useForm();
  const {errors} = formState;
  const [useShippingAddress, setUseShippingAddress] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successToast, setSuccessToast] = useState(false);
  const [failureToast, setFailureToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const {data, refetch} = useQuery(GET_SHIPPING_ADDRESSES);
  const [returnOrder, {loading: returnLoading, error: returnError}] =
    useMutation(RETURN_ORDER);

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
  useEffect(() => {
    if (selectedGovernorate) {
      const governorate = governorates.find(
        gov => gov.value === selectedGovernorate,
      );
      if (governorate) {
        setVillages(governorate.villages || []);
        console.log('Villages Updated:', governorate.villages);
      }
    }
  }, [selectedGovernorate]);

  const processImageForUpload = async imagePickerResponse => {
    if (
      !imagePickerResponse.assets ||
      imagePickerResponse.assets.length === 0
    ) {
      throw new Error('No image selected');
    }

    return imagePickerResponse.assets.map(asset => ({
      uri: asset.uri,
      name: asset.fileName || `upload.${asset.type?.split('/')[1] || 'jpg'}`,
      type: asset.type || 'image/jpeg',
    }));
  };

  //API
  const uploadFiles = async (files, filePath) => {
    const formData = new FormData();

    // Append each file to FormData
    files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    // Append additional data
    formData.append('filePath', filePath);

    try {
      const response = await instance.post('/file-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response); // Store the server response
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleGovernorateChange = item => {
    setGovernorateName(item?.label);
    setSelectedGovernorate(item.value);
    setVillages(item?.villages || []);
    setSelectedVillage(null);
    setVillageName('');

    setValue('governorate', item.label);
    setValue('governorateID', item.value);
  };

  const onSubmitHandler = async formData => {
    try {
      const processedImages = await processImageForUpload(selectedImage);

      // Upload files to server
      const uploadResponse = await uploadFiles(
        processedImages,
        filePaths.returnProduct,
      );
      console.log(uploadResponse?.data);
      if (!uploadResponse?.data) {
        throw new Error('Upload failed. Images are required!');
      }

      const input = {
        _id: route?.params?.orderId || null, // Ensure order ID is provided
        returnUserReason: formData.returnUserReason || null,
        returnAddress: {
          firstname: formData.firstname,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          email: formData.email,
          mobile: formData.mobile,
          postCode: formData.postCode,
          governorate: governorateName,
          governorateID: selectedGovernorate,
          village: villageName,
          villageID: selectedVillage,
        },
        bankDetails: {
          accountHolderName: formData.accountHolderName || null,
          accountNumber: formData.accountNumber || null,
          bankName: formData.bankName || null,
          branchName: formData.branchName || null,
          ifscCode: formData.ifscCode || null,
        },
        returnProductImage: uploadResponse?.data,
      };

      const variables = {
        input,
      }; // Handle image upload separately

      const response = await returnOrder({variables});

      if (response?.data?.returnUserOrderProductInMob?._id) {
        //refetch();
        setSuccessToast(true);
        setToastMessage('Return order submitted successfully!');
        await refetch();
        setTimeout(() => {
          setSuccessToast(false);
          navigation.navigate('Orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting return order:', error);
      setFailureToast(true);
      setToastMessage(error.message);
      setTimeout(() => {
        setFailureToast(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (
      useShippingAddress &&
      data?.getMobileUserShippingAddresses?.address?.length > 0
    ) {
      const shipping = data?.getMobileUserShippingAddresses?.address?.find(
        addr => addr.isDefault,
      ); // Assuming the first address
      if (shipping) {
        setValue('firstname', shipping.firstname || '');
        setValue('address', shipping.address || '');
        setValue('city', shipping.city || '');
        setValue('country', shipping.country || '');
        setValue('email', shipping.email || '');
        setValue('mobile', shipping.mobile || '');
        setValue('postCode', shipping.postCode || '');
        setGovernorateName(shipping.governorate || '');
        setSelectedGovernorate(shipping.governorateID || '');
        setVillageName(shipping.village || '');
        setSelectedVillage(shipping.villageID || '');
      }
    } else {
      // Reset fields when toggle is off
      setValue('firstname', '');
      setValue('address', '');
      setValue('city', '');
      setValue('country', '');
      setValue('email', '');
      setValue('mobile', '');
      setValue('postCode', '');
      setGovernorateName('');
      setSelectedGovernorate(null);
      setVillageName('');
      setSelectedVillage(null);
    }
  }, [useShippingAddress, data]);

  return (
    <ScrollView
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}
      contentContainerStyle={{paddingHorizontal: 10}}>
      <Header title={'Return Order'} search={true} />

      <Text style={[styles.txt]}>
        Reason for returning order{' '}
        <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="returnUserReason"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=" "
            onChangeText={field.onChange}
            value={field.value}
            numberOfLines={2}
          />
        )}
        rules={{required: 'Return Reason is required'}}
      />
      {errors.returnUserReason && (
        <Text style={{color: 'red'}}>{errors.returnUserReason.message}</Text>
      )}
      <View style={{height: 10}} />
      {/*}  <Controller
                     name=""
                     control={control}
                     defaultValue=""
                     render={({ field }) => (
                       <AppTextInput
                         placeholder="Choose file from gallery "
                         onChangeText={field.onChange}
                         value={field.value}
                         numberOfLines={2}
                       />
                     )}
                   />*/}
      <TouchableOpacity
        onPress={handleImagePicker}
        style={[
          styles.tch,
          {
            borderColor: colors.inputborder,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
          },
        ]}>
        <Text style={{}}>Choose file</Text>
        <Camera size={17} color={colors.primary} />
      </TouchableOpacity>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5,
        }}>
        {selectedImage?.assets &&
          selectedImage?.assets?.length > 0 &&
          selectedImage?.assets?.map(el => (
            <Image
              key={el.fileName}
              source={{uri: el?.uri}}
              style={{width: 100, height: 100}}
            />
          ))}
      </View>
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>RETURN ADDRESS</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginRight: 110,
        }}>
        <Icon
          name={
            useShippingAddress ? 'checkbox-marked' : 'checkbox-blank-outline'
          }
          size={24}
          color={'#9E9E9E'}
          onPress={() => setUseShippingAddress(prev => !prev)}
        />
        <Text style={[styles.txt1, {}]}>
          use shipping address as return address
        </Text>
      </View>
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Full name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="firstname"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
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
      {/*}  <Text style={[styles.txt, { color: colors.primary }]}>
        Country / Region <Text style={[styles.txt, { color: 'red' }]}>*</Text>
      </Text>
      <Controller
        name="country"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <AppTextInput
            placeholder="Country / Region"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{ required: 'Country is required' }}
      />
      {errors.country && (
        <Text style={{ color: 'red' }}>{errors.country.message}</Text>
      )}
       <View style={{ height: 10 }} />*/}
      <Text style={[styles.txt]}>
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
        rules={{required: ' Phone nunber is required'}}
      />
      {errors.mobile && (
        <Text style={{color: 'red'}}>{errors.mobile.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
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
        rules={{required: ' Email is required'}}
      />
      {errors.email && (
        <Text style={{color: 'red'}}>{errors.email.message}</Text>
      )}
      <Text style={[styles.txt]}>
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
      <Text style={[styles.txt]}>
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
      <Text style={[styles.txt]}>
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
        //setValue={setSelectedVillage}
        setValue={callback => {
          const newValue =
            typeof callback === 'function'
              ? callback(selectedVillage)
              : callback;
          console.log('Dropdown Selected Village ID:', newValue);
          setSelectedVillage(newValue);
          const selectedVillageObj = villages.find(v => v._id === newValue);
          if (selectedVillageObj) {
            setVillageName(selectedVillageObj.name);
            setValue('village', selectedVillageObj.name);
            setValue('villageID', newValue);
          }
        }}
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

      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Post <Text style={[styles.txt, {color: 'red'}]}>*</Text>
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
        rules={{required: ' Pincode is required'}}
      />
      {errors.postCode && (
        <Text style={{color: 'red'}}>{errors.postCode.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>BANK DETAILS</Text>

      <Text style={[styles.txt]}>
        Recepient's name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="accountHolderName"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Account holder name is required'}}
      />
      {errors.accountHolderName && (
        <Text style={{color: 'red'}}>{errors.accountHolderName.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Account number <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="accountNumber"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Account Number is required'}}
      />
      {errors.accountNumber && (
        <Text style={{color: 'red'}}>{errors.accountNumber.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Bank name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="bankName"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Bank name is required'}}
      />
      {errors.bankName && (
        <Text style={{color: 'red'}}>{errors.bankName.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Branch name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="branchName"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Branch name is required'}}
      />
      {errors.branchName && (
        <Text style={{color: 'red'}}>{errors.branchName.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        Swift code <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="ifscCode"
        control={control}
        defaultValue=""
        render={({field}) => (
          <AppTextInput
            placeholder=""
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        rules={{required: 'Swift code is required'}}
      />
      {errors.ifscCode && (
        <Text style={{color: 'red'}}>{errors.ifscCode.message}</Text>
      )}
      <View style={{height: 10}} />

      <View style={{height: 30}} />
      <AppButton
        title="Submit"
        onPress={handleSubmit(onSubmitHandler)}
        containerColor={colors.primary}
        textColor={colors.secondary}
        fontSize={14}
        loading={returnLoading}
      />
      <View style={{height: 10}} />

      <SuccesToast
        visible={successToast}
        message={toastMessage}
        onClose={() => setSuccessToast(false)}
      />
      <FailureToast
        visible={failureToast}
        message={toastMessage}
        onClose={() => setFailureToast(false)}
      />
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
  txt1: {
    fontFamily: 'Poppins-Medium',

    fontSize: 14,
    marginLeft: 10,
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
  tch: {
    width: '97%',
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    // borderColor: "grey",
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
    }),
  },
});
