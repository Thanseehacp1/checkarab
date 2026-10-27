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
import Header from '../postAuthComponents/Header';
import {launchImageLibrary} from 'react-native-image-picker';
import SuccesToast from '../productComponents/SuccesToast';
import FailureToast from '../productComponents/FailureToast';
import {
  GET_SHIPPING_ADDRESSES,
  GET_LOCATION,
} from '../../graphQl/queries/Queries';
import {useMutation, useQuery} from '@apollo/client';
import {WARRANTY_ORDER} from '../../graphQl/mutations/mutations';
import DropdownPicker from 'react-native-dropdown-picker';
import {Camera} from 'iconsax-react-native';
import {filePaths} from '../../config/filePath';
import { instance } from '../../config/common.config';
export default function WarrantyOrder({navigation, route}) {
  const orderId = route?.params?.orderId;
  const productId = route?.params?.productId;
  const claimType = route?.params?.warrantyType || [];
  //console.log("claim",claimType);
  const [successToast, setSuccessToast] = useState(false);
  const [failureToast, setFailureToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const {colors} = useTheme();
  const {control, handleSubmit, setValue, formState} = useForm({
    defaultValues: {
      claimType: claimType.length > 0 ? claimType[0] : '',
    },
  });
  const {errors} = formState;
  const [useShippingAddress, setUseShippingAddress] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const [
    createWarrantyClaim,
    {loading: warrantyLoading, error: warrantyError},
  ] = useMutation(WARRANTY_ORDER);

  const {
    data: getLocation,
    loading: getLocationLoading,
    error: getLocationError,
  } = useQuery(GET_LOCATION);

  useEffect(() => {
    if (claimType.length > 0) {
      setValue('claimType', claimType[0]); // Set the first value by default
    }
  }, [claimType, setValue]);

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

  const onSubmitHandler = async formData => {
    try {
      const processedImages = await processImageForUpload(selectedImage);

      // Upload files to server
      const uploadResponse = await uploadFiles(
        processedImages,
        filePaths.warrantyProduct,
      );

      if (!uploadResponse?.data) {
        throw new Error('Upload failed. Images are required!');
      }

      const input = {
        claimType: String(formData.claimType || claimType || ''),
        issueDescription: formData.issueDescription || null,
        productId: route?.params?.orderId || null, // Ensure product ID is provided
        warrantyAddress: {
          firstname: formData.firstname,
          address: formData.address,
          country: formData.country,
          email: formData.email,
          mobile: formData.mobile,
          postCode: formData.postCode,
          governorate: governorateName,
          governorateID: selectedGovernorate,
          village: villageName,
          villageID: selectedVillage,
        },
        productImage: uploadResponse?.data,
      };

      const variables = {input}; // Handle image upload separately

      console.log('Submitting warranty claim:', input);
      const response = await createWarrantyClaim({variables});

      console.log('Warranty claim response:', response);

      if (response?.data?.createWarrantyClaimRequestByUSerInMobile?.success) {
        //alert("Warranty claim submitted successfully!");
        setSuccessToast(true);
        setToastMessage('Warranty claim submitted successfully!!');
        setTimeout(() => {
          setSuccessToast(false);
          navigation.navigate('Orders');
        }, 3000);
        //navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting warranty claim:', error);
      setFailureToast(true);
      setToastMessage('Error submitting warranty claim:', error);
      setTimeout(() => {
        setFailureToast(false);
      }, 3000);
    }
  };

  useEffect(() => {
    console.log('IMAGES', selectedImage);
  }, [selectedImage]);

  return (
    <ScrollView
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}
      contentContainerStyle={{paddingHorizontal: 10}}>
      <Header title={'Complaint Registration'} search={true} />

      <Text style={[styles.txt]}>
        Explain your complaint{' '}
        <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="issueDescription"
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
        rules={{required: ' Reason is required'}}
      />
      {errors.issueDescription && (
        <Text style={{color: 'red'}}>{errors.issueDescription.message}</Text>
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
          styles.img,
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
      <Text style={[styles.txt, {color: colors.primary}]}>YOUR ADDRESS</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <Icon
          name={
            useShippingAddress ? 'checkbox-marked' : 'checkbox-blank-outline'
          }
          size={24}
          color={'#9E9E9E'}
          onPress={() => setUseShippingAddress(prev => !prev)}
        />
        <Text style={[styles.txt1, {}]}>use shipping address</Text>
      </View>
      <View style={{height: 10}} />
      <Text style={[styles.txt]}>
        First name <Text style={[styles.txt, {color: 'red'}]}>*</Text>
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
        Contact number <Text style={[styles.txt, {color: 'red'}]}>*</Text>
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

      {/*} <View style={{ height: 20 }} />

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
      )}
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
      <Text style={[styles.txt]}>
        Country <Text style={[styles.txt, {color: 'red'}]}>*</Text>
      </Text>
      <Controller
        name="country"
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
        rules={{required: ' Country is required'}}
      />

      {errors.country && (
        <Text style={{color: 'red'}}>{errors.country.message}</Text>
      )}
      <View style={{height: 10}} />
      <Text style={[styles.txt, {color: colors.primary}]}>Claim Type</Text>
      {claimType.map((item, index) => (
        <Controller
          key={index}
          name="claimType"
          control={control}
          rules={{required: 'Claim Type is required!'}}
          render={({field}) => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
              onPress={() => field.onChange(item)}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                {field.value === item && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ))}

      <View style={{height: 30}} />
      <AppButton
        title="Submit"
        onPress={handleSubmit(onSubmitHandler)}
        containerColor={colors.primary}
        textColor={colors.secondary}
        fontSize={14}
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
  img: {
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
