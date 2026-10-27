import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useQuery, useMutation} from '@apollo/client';
import NavigationComponent from '../../../../components/postAuthComponents/NavigationComponent';
import {More} from 'iconsax-react-native';
import ButtonSmall from '../../../../components/postAuthComponents/ButtonSmall';
import Header from '../../../../components/postAuthComponents/Header';
import {GET_ORDERS} from '../../../../graphQl/queries/Queries';
import SuccesToast from '../../../../components/productComponents/SuccesToast';
import {
  CANCEL_ORDER,
  DOWNLOAD_INVOICE,
} from '../../../../graphQl/mutations/mutations';
import dayjs from 'dayjs';
import DropdownPicker from 'react-native-dropdown-picker';
import {h} from '../../../../utils/PercentageToDp';
import LottieView from 'lottie-react-native';
import AppButton from '../../../../components/preAuthComponents/AppButton';
import {useCallback} from 'react';
import {windowConfirm} from '../../../../utils/confirmation';
import {useFocusEffect} from '@react-navigation/native';
const {height, width} = Dimensions.get('window');
export default function Orders({route, navigation, orderId}) {
  const {colors} = useTheme();
  const [orders, setOrders] = useState([]);
  const [perPage] = useState();
  const [page, setPage] = useState(0);
  const [modal, setmodal] = useState(false);
  //
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const [cancelUserReason, setCancelUserReason] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  //

  const handleBackdropPress = () => {
    setmodal(false);
  };
  const {
    data,
    loading: isOrdersLoading,
    error,
    refetch,
  } = useQuery(GET_ORDERS, {
    variables: {
      input: {page, size: 10},
    },
    fetchPolicy: 'network-only',
  });

  const [cancelUserOrderProduct] = useMutation(CANCEL_ORDER);
  const [downloadInvoice] = useMutation(DOWNLOAD_INVOICE);

  useEffect(() => {
    if (data?.getUserOrderProductsInMobile?.records) {
      setOrders(data.getUserOrderProductsInMobile.records);
    }
  }, [data]);

  const menuOptions = item => {
    let options = [];
    if (item?.shippingStatus === 'DELIVERED' && item?.returnStatus === 'NA') {
      options.push({label: 'Return', value: 'return'});
    }

    if (item?.shippingStatus === 'DELIVERED') {
      options.push({label: 'Invoice', value: 'invoice'});
    }
    if (
      item?.shippingStatus === 'DELIVERED' &&
      item?.warranty?.warrantyRegister === true &&
      (item?.warrantyClaimStatus === null ||
        item?.warrantyClaimStatus === 'REJECTED' ||
        item?.warrantyClaimStatus === 'REPLACEMENT_COMPLETED')
    ) {
      options.push({label: 'Warranty', value: 'warranty'});
    }
    //console.log("returnstatus",item?.warrantyClaimStatus);

    return options;
  };

  const handleMenuPress = (event, item) => {
    if (item.shippingStatus === 'DELIVERED' && item?.returnStatus === 'NA') {
      setMenuPosition({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      });
      setMenuVisible(item._id);
    }
  };

  const handleSelection = (value, item) => {
    setMenuVisible(false);

    switch (value) {
      case 'invoice':
        handleDownloadInvoice(item._id);
        break;
      case 'warranty':
        navigation.navigate('WarrantyPolicy', {
          orderId: item._id,
          productId: item.productId,
        });
        break;
      case 'return':
        navigation.navigate('ReturnPolicy', {orderId: item._id});
        break;
      default:
        break;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return '#FFA500';
      case 'SHIPPED':
        return '#44961D';
      default:
        return '#000000';
    }
  };

  const getReturnStatusColor = status => {
    switch (status) {
      case 'PENDING':
        return '#FFC107';
      case 'APPROVED':
        return '#28A745';
      case 'REJECTED':
        return '#DC3545';
      case 'COLLECTED':
        return '#17A2B8';
      default:
        return '#17A2B8';
    }
  };
  const handleCancelOrder = async id => {
    try {
      if (
        !(await windowConfirm('Are you sure you want to cancel this order?'))
      ) {
        return;
      }
      await cancelUserOrderProduct({
        variables: {input: {_id: id, cancelUserReason: cancelUserReason}},
      });
      setmodal(true);
      refetch();
      // Alert.alert("Success", "Your order has been canceled.");

      setTimeout(() => {
        setmodal(false);
      }, 3000);
    } catch (error) {
      console.error('Cancel Order Error:', error);
    }
  };

  const handleDownloadInvoice = async id => {
    try {
      const invoice = await downloadInvoice({
        variables: {input: {_id: id}},
      });
      const url = invoice.data.getUserIvoiceSignedUrlInMobile.url;
      Linking.openURL(url);
      Alert.alert('Invoice', `Download your invoice: ${url}`);
    } catch (error) {
      console.error('Invoice Download Error:', error);
    }
  };

  const OrderCard = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        <View
          style={styles.rowContainer}
          onPress={() =>
            navigation.navigate('ProductDetails', {
              productId: item.productId,
              productName: item.productName,
              productImage: item.images?.[0]?.fileURL,
              twist: true,
            })
          }>
          <View style={[styles.imgContainer]}>
            <Image
              source={{uri: item.image.fileURL}}
              style={{width: width * 0.24, height: width * 0.37}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, {color: colors.primary}]}>
              {item.productName}
            </Text>
            <Text style={[styles.ord, {color: colors.primary}]}>
              {item.orderId}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.dateAndStatus, {color: colors.primary}]}>
                {dayjs(item.orderDate).format('DD/MM/YYYY')}{' '}
              </Text>
              <Text
                style={[
                  styles.dateAndStatus,
                  {
                    color:
                      item?.returnStatus !== 'NA'
                        ? getReturnStatusColor(item?.returnStatus)
                        : getStatusColor(item?.shippingStatus),
                  },
                ]}>
                {item?.returnStatus !== 'NA'
                  ? `${item?.returnStatus} - (Return)`
                  : item?.shippingStatus.replace(/_/g, ' ')}
              </Text>
            </View>
            <Text style={styles.price}>OMR {item.sellingPrice}</Text>
          </View>
          <TouchableOpacity
            onPress={event => handleMenuPress(event, item)}
            style={styles.moreIcon}>
            <More size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Modal
          transparent
          visible={menuVisible === item._id}
          //animationType="fade"
        >
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}>
            <View
              style={[
                styles.dropdown,
                {top: menuPosition.y, left: menuPosition.x - 100},
              ]}>
              {menuOptions(item).map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleSelection(option.value, item);
                  }}
                  disabled={
                    item?.shippingStatus === 'DELIVERED' &&
                    !item?.invoice &&
                    option.value === 'invoice'
                  }>
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color:
                          item?.shippingStatus === 'DELIVERED' &&
                          !item?.invoice &&
                          option.value === 'invoice'
                            ? '#c2c2c2'
                            : 'black',
                      },
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.buttonContainer}>
          {item.shippingStatus !== 'CANCELED' &&
            item?.shippingStatus !== 'DELIVERED' && (
              <ButtonSmall
                title="Cancel "
                width={'47%'}
                textColor={colors.primary}
                backgroundColor={colors.secondary}
                maxHeight={51}
                fontSize={13}
                onPress={() => handleCancelOrder(item._id)}
              />
            )}
          <ButtonSmall
            title="View Order"
            width={'47%'}
            textColor={colors.secondary}
            backgroundColor={colors.primary}
            maxHeight={48}
            fontSize={13}
            onPress={() =>
              navigation.navigate('ProductDetails', {
                productId: item.productId, // Pass the product ID
                productName: item.productName, // Pass the product name (if needed)
                productImage: item.images?.[0]?.fileURL,
                twist: true,
              })
            }
            //onPress={() => navigation.navigate('Return', { orderId: item._id })}
            // onPress={() => handleDownloadInvoice(item._id)}
          />
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);

  const loading = isOrdersLoading || refreshing;

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      refetch().then(() => setRefreshing(false));
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}>
      <Header title={'Orders'} search={true} horizontal={10} />

      {loading && (
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
      {!loading && data?.getUserOrderProductsInMobile?.records?.length > 0 && (
        <>
          <View style={{height: 10}} />
          <NavigationComponent title="Orders" selected={true} left={10} />
          <View style={{height: 25}} />
          {data?.getUserOrderProductsInMobile?.records?.length > 0 &&
            data.getUserOrderProductsInMobile.records
              // && data.getUserOrderProductsInMobile ? (data.getUserOrderProductsInMobile.records.
              .map(item => <OrderCard key={item._id} item={item} />)}
          <SuccesToast
            visible={modal}
            message="Your order has been cancelled"
            onClose={() => setmodal(false)}
          />
        </>
      )}
      {!loading &&
        data?.getUserOrderProductsInMobile?.records?.length === 0 && (
          <View
            style={{
              flex: 1,
              height: h(120),
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}>
            <View
              style={{
                width: 300,
                height: 200,
              }}>
              <LottieView
                source={require('../../../../assets/lottiefiles/empty_orderlist.json')}
                autoPlay
                style={{
                  width: 300,
                  height: 300,
                }}
                loop
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 20,
                marginTop: 40,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Semibold',
                  fontSize: 18,
                }}>
                No orders found!
              </Text>
              <Text
                style={{
                  fontSize: 13,
                }}>
                Start shopping now and fill it with amazing deals!
              </Text>
              <View style={{marginTop: 15, paddingHorizontal: 55}}>
                <AppButton
                  title="Shop Now "
                  containerColor={colors.primary}
                  textColor={colors.secondary}
                  fontSize={14}
                  onPress={() => navigation.navigate('OffersScreen')}
                />
              </View>
            </View>
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  imgContainer: {
    height: 90,
    width: 90,
    borderRadius: 8,

    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 53,
    width: 53,
    resizeMode: 'contain',
  },
  infoContainer: {
    marginLeft: 30,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  dateAndStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
  },
  price: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
  },
  ord: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
  },
  cardContainer: {
    marginVertical: 10,
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  statusTxt: {
    fontFamily: 'Poppins-SemiBold',
    matginTop: 5,
  },
  moreIcon: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    //backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#ebeae8',
    padding: 10,
    borderRadius: 8,
    //elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    // color: 'black',
  },
});
