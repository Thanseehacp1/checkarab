import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {RecordCircle} from 'iconsax-react-native';
import {GET_SHIPPING_ADDRESSES} from '../../../../graphQl/queries/Queries';
import NavigationComponent from '../../../../components/postAuthComponents/NavigationComponent';
import ButtonSmall from '../../../../components/postAuthComponents/ButtonSmall';
import Header from '../../../../components/postAuthComponents/Header';
import {useMutation, useQuery} from '@apollo/client';
import {
  REMOVE_ADDRESS,
  DEFAULT_ADDRESS,
  UPDATE_SHIPPING,
} from '../../../../graphQl/mutations/mutations';
import SuccesToast from '../../../../components/productComponents/SuccesToast';
import FailureToast from '../../../../components/productComponents/FailureToast';
import {h, w} from '../../../../utils/PercentageToDp';
import {windowConfirm} from '../../../../utils/confirmation';
import LottieView from 'lottie-react-native';
import {useCallback} from 'react';
export default function Addresses({route, navigation}) {
  const {colors} = useTheme();
  const twistValue = route.params?.twist || false;

  const {data, loading: isShippingAddressLoading, error, refetch} = useQuery(GET_SHIPPING_ADDRESSES);

  // Define mutations for removing an address and setting it as default
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [removeAddress] = useMutation(REMOVE_ADDRESS);
  const [setDefaultAddress] = useMutation(DEFAULT_ADDRESS);
  const [updateShippingAddress] = useMutation(UPDATE_SHIPPING);
  const [isEdit, setIsedit] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data && data.getMobileUserShippingAddresses?.address) {
      const sortedAddresses = [
        ...data.getMobileUserShippingAddresses.address,
      ].sort((a, b) => b.isDefault - a.isDefault);
      setAddresses(sortedAddresses);
    }
    refetch();
  }, [data]);
  const handleBackdropPress = () => {
    setModalVisible(false);
  };
  setTimeout(() => {
    setModalVisible(false);
  }, 3000);
  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);
  const defaultAddress = addresses.find(address => address.isDefault);
  const handleRemoveAddress = async id => {
    try {
      if (
        !(await windowConfirm('Are you sure you want to delete the address?'))
      ) {
        return;
      }

      console.log('Attempting to delete address with ID:', id);
      const response = await removeAddress({variables: {input: {_id: id}}});
      // refetch();
      console.log('Delete response:', response);
      if (response?.data?.removeMobileUserShippingAddress) {
        // Update the local state by filtering out the deleted address
        setModalVisible(true);
        setToastMessage(
          response?.data?.removeMobileUserShippingAddress?.message,
        );
        // Alert.alert('Success', response?.data?.removeMobileUserShippingAddress?.message);
        await refetch();
      }
    } catch (error) {
      console.error('🚨 GraphQL Mutation Error:', error); // ✅ Log the actual error
      //Alert.alert('Error', `Error deleting address: ${error.message}`);
      setModal(true);
      setToastMessage('${error.message}');
    }
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = async id => {
    try {
      console.log(id, 'ADDRESS ID');
      const response = await setDefaultAddress({
        variables: {input: {addressId: id}},
      });

      if (response?.data?.updateMobileUserShippingAddressAsDefault?.message) {
        // Alert.alert('Success', response?.data?.updateMobileUserShippingAddressAsDefault?.message);
        setModalVisible(true);
        setToastMessage(
          response?.data?.updateMobileUserShippingAddressAsDefault?.message,
        );
        // Reorder addresses after setting a default
        setAddresses(prevAddresses => {
          return [...prevAddresses]
            .map(address => ({
              ...address,
              isDefault: address._id === id ? true : false,
            }))
            .sort((a, b) => b.isDefault - a.isDefault);
        });
        try {
          await refetch();
        } catch (refetchError) {
          console.error('🚨 Error during refetch:', refetchError);
        }
      }
    } catch (error) {
      console.log(error, 'ERROR IN SETTING DEFAULT');
      //Alert.alert('Error', 'There was an error setting the default address.');
      setModal(true);
      setToastMessage('There was an error setting the default address.');
    }
  };
  {
    /*} const handleUpdateShippingAddress = async (address) => {
    try {
      const response = await updateShippingAddress({
        variables: { input: address },
      });
      refetch();
      Alert.alert('Success', 'Shipping address updated successfully!');

    } catch (error) {
      Alert.alert('Error', 'There was an error updating the shipping address.');
    }
  };*/
  }
  const RenderItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        {item.isDefault && (
          <View style={styles.defaultButton1}>
            <Text style={styles.buttonText}> Default</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
          <Text style={[styles.titleText, {color: colors.primary}]}>
            {item.label}
          </Text>
          {!item.isDefault && (
            <TouchableOpacity
              style={styles.defaultButton}
              onPress={() => handleSetDefaultAddress(item._id)}>
              <Text style={styles.buttonText}>Set as Default</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{height: 10}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{marginLeft: 10}}>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              {item.firstname}
            </Text>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              {item.address}, {item.houseNumber}
            </Text>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              Post Code : {item.postCode}
            </Text>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              {item.country}
            </Text>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              {item.governorate}
            </Text>
            <Text style={[styles.disTxt, {color: colors.primary}]}>
              {item.village}
            </Text>
          </View>
        </View>
        <View style={{height: 30}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <ButtonSmall
            title="Edit Address"
            width={'48%'}
            textColor={colors.secondary}
            backgroundColor={colors.primary}
            maxHeight={51}
            fontSize={12}
            onPress={() => {
              navigation.navigate('Add Address', {editAddress: item});
            }}
            style={{padding: 5}}
          />
          <ButtonSmall
            title="Delete "
            width={'48%'}
            textColor={colors.primary}
            backgroundColor={colors.secondary}
            maxHeight={51}
            fontSize={12}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
              console.log('Delete button clicked for address ID:', item._id);
              handleRemoveAddress(item._id);
            }}
            style={{padding: 5}}
          />
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);

  const loading = isShippingAddressLoading || refreshing;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={[styles.maincontainer, {backgroundColor: colors.secondary}]}>
      <FlatList
        ListHeaderComponent={
          <>
            <Header title={'Addresses'} search={true} />
            <View style={{height: 10}} />
            <NavigationComponent
              title="Addresses"
              selected={true}
              twist={twistValue}
            />
            <View style={{height: 30}} />

            <View style={styles.cardContainer}>
              <Text style={[styles.titleText, {color: colors.primary}]}>
                {' '}
                Addresses
              </Text>

              {addresses && addresses?.length <= 0 && (
                <Text
                  style={[
                    styles.noAddressText,
                    {fontFamily: 'Poppins-Regular', marginTop: 10},
                  ]}>
                  You have not set up this type of address yet.
                </Text>
              )}

              {/*} <Text style={[styles.disTxt, { color: colors.grey }]}>

                                                 </Text>*/}
              {/*<View style={{height: 30}} />*/}

              <View style={{height: 15}} />
              <ButtonSmall
                title="Add Address"
                backgroundColor={colors.secondary}
                width={'50%'}
                textColor={colors.primary}
                maxHeight={51}
                onPress={() => navigation.navigate('Add Address')}
                fontSize={12}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                minHeight: h(50),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={32} />
            </View>
          ) : (
            <View
              style={{
                minHeight: h(70),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 150,
                  height: 150,
                }}>
                <LottieView
                  source={require('../../../../assets/lottiefiles/NotFoundBanner.json')}
                  autoPlay
                  style={{
                    width: 150,
                    height: 150,
                  }}
                  loop
                />
              </View>
            </View>
          )
        }
        data={addresses}
        keyExtractor={item => item._id}
        renderItem={RenderItem}
        nestedScrollEnabled={true}
      />
      <SuccesToast
        visible={modalVisible}
        message={toastMessage}
        onClose={() => setModalVisible(false)}
      />
      <FailureToast
        visible={modal}
        message={toastMessage}
        onClose={() => setModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CDCDCD',
    marginBottom: 20,
    marginRight: 5,
    borderRadius: 5,
    padding: 20,
  },
  disTxt: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  maincontainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginRight: 10,
  },
  defaultButton: {
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  defaultButton1: {
    position: 'absolute',
    backgroundColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 28,
    top: h(3),
    right: -h(12),
    transform: [{rotate: '45deg'}],
    minWidth: w(20),
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});
