import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Add, Heart} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';
import AddToCart from '../../../../components/productComponents/AddedToCart';
import Header from '../../../../components/postAuthComponents/Header';
import {useMutation, useQuery} from '@apollo/client';

import {
  ADD_TO_CART,
  REMOVE_FROM_WISHLIST,
} from '../../../../graphQl/mutations/mutations';
import {GET_WISHLIST} from '../../../../graphQl/queries/Queries';
import {useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AppButton from '../../../../components/preAuthComponents/AppButton';
import {h} from '../../../../utils/PercentageToDp';
import {useSelector} from 'react-redux';

const {height, width} = Dimensions.get('window');

export default function WishList({navigation}) {
  //IMPORTS
  const {token, user} = useSelector(state => state.auth) || '';
  const {colors} = useTheme();

  //STATES
  const [modal, setmodal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  //QUERIES
  const {data, loading: isLoadingWishlist, error, refetch} = useQuery(GET_WISHLIST);

  //MUTATIONS
  const [addToCart] = useMutation(ADD_TO_CART);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  //HANDLERS
  const handleBackdropPress = () => {
    setmodal(false);
  };
  const handleNavigation = () => {
    setmodal(false);
    navigation.navigate('CartScreen');
  };
  const handleAddtoCart = async item => {
    try {
      const {data} = await addToCart({
        variables: {
          input: {
            productId: item?.productId,
            quantity: 1,
          },
        },
      });
      console.log(data, 'aaaaaddddddd');
      if (data?.addToCartInMobile?.message == 'Items added to cart') {
        setItemName(item?.name);
        setmodal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemove = async item => {
    try {
      const {data} = await removeFromWishlist({
        variables: {
          input: {
            productId: item?.productId,
          },
        },
      });

      if (data?.removeFromMobileWishList?.message) {
        // Alert.alert("Success", data?.removeFromMobileWishList?.message)
        refetch();
      }
    } catch (error) {
      console.log(error, 'REMOVE ERROR');
    }
  };

  //RENDER ITEM
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.card, {width: '47%', marginBottom: 10}]}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item.productId, // Pass the product ID
            productName: item.name, // Pass the product name (if needed)
            productImage: item.images?.[0]?.fileURL,
            //discountPercentage:item.discountPercentage,
            twist2: true,
          })
        }>
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.imgContainer]}>
            {/*} <FastImage
              source={item.image}
              style={{width: width * 0.24, height: width * 0.37}}
              resizeMode="contain"
            /> */}
            <Image
              source={{uri: item.image}}
              style={{width: width * 0.24, height: width * 0.37}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.wishConatiner}>
            <TouchableOpacity
              style={[styles.circleContainer]}
              onPress={() => handleRemove(item)}>
              <Heart
                size={height * 0.028}
                color={colors.tertiary}
                variant="Bold"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.nameTxt, {color: 'black'}]}>
          {item.productName && item.productName.length > 40
            ? `${item.productName.substring(0, 40)}...`
            : item.productName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            //marginTop: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[styles.omrTxt]}>OMR {item.sellingPrice}</Text>
          {/*<Text style={[styles.boldText, {color: colors.primary}]}>
            {' '}
            {item.actualprice}
          </Text>
       
        <Text style={styles.originalPrice}>{item?.originalprice}</Text>*/}
        </View>
        {/*} <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end', // Keep the Add button aligned to the right
            alignItems: 'center',
            marginBottom: 10,
          }}>
         {/*} <View
            style={[styles.discountContainer, {backgroundColor: '#44961D0D'}]}>
            <PercentageSquare
              size={height * 0.025}
              color="#44961D"
              variant="Bold"
            />
            <Text style={[styles.offTxt, {color: colors.offrclr}]}>
              30% OFF
            </Text>
          </View>*/}
        <TouchableOpacity
          style={[styles.circleAdd, {backgroundColor: colors.primary}]}
          onPress={() => handleAddtoCart(item)}>
          <Add size={height * 0.02} color={colors.secondary} />
        </TouchableOpacity>
        {/*} </View>*/}
      </TouchableOpacity>
    );
  };

  // Refetch when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  //CHECK AUTH
  useEffect(() => {
    if (!token) {
      navigation.navigate('PhoneLogin');
    }
  }, [token]);

  const onRefresh = useCallback(() => {
    console.log('refreshing...');
    setRefreshing(true);
    refetch().then(() => {
      console.log('refetched...');
      setRefreshing(false);
    });
  }, []);

  const loading = isLoadingWishlist || refreshing

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={[styles.mainContainer, {backgroundColor: colors.secondary}]}>
      <Header title={'Wishlist'} />
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
      {!loading && data?.getMobileWishListProducts?.products?.length > 0 && (
        <FlatList
          renderItem={renderItem}
          data={data?.getMobileWishListProducts?.products}
          keyExtractor={item => item?.productId}
          contentContainerStyle={[styles.contentContainer]}
          //{ justifyContent: 'space-between' },]}
          numColumns={2}
        />
      )}

      {!loading && data?.getMobileWishListProducts?.products?.length <= 0 && (
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
              source={require('../../../../assets/lottiefiles/empty_wishlist.json')}
              autoPlay
              style={{
                width: 300,
                height: 300,
              }}
              loop
            />
          </View>
          <View style={{alignItems: 'center', gap: 8, marginTop: 40}}>
            <Text
              style={{
                fontFamily: 'Poppins-Semibold',
                fontSize: 18,
              }}>
              Your wishlist is empty!
            </Text>
            <Text
              style={{
                fontSize: 13,
              }}>
              Start shopping now and fill it with amazing deals!
            </Text>
          </View>
          <View style={{paddingHorizontal: 60, marginTop: 5}}>
            <AppButton
              title="Shop Now "
              containerColor={colors.primary}
              textColor={colors.secondary}
              fontSize={14}
              onPress={() => navigation.navigate('OffersScreen')}
            />
          </View>
        </View>
      )}
      <AddToCart
        isVisible={modal}
        onBackdropPress={handleBackdropPress}
        itemName={itemName}
        continueShopping={handleBackdropPress}
        handleNavigation={handleNavigation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
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

  // contentContainer: {alignItems: 'center'},
  mainContainer: {paddingHorizontal: 7, flex: 1},
  singleItem: {
    width: '100%', // Adjust to take full width for single items
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 3,
    paddingVertical: 18,
  },
  wishConatiner: {},
  circleContainer: {
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-end',
    backgroundColor: 'white',
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
  discountContainer: {
    flexDirection: 'row',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  circleAdd: {
    padding: 3.5,
    borderRadius: 30,
    //justifyContent: 'center',
    //alignItems: 'center', // Center the icon inside the circle
    alignSelf: 'flex-end',
  },
  recomTxt: {
    marginLeft: 10,
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold',

    fontSize: height * 0.0245,
  },
  nameTxt: {
    fontFamily: 'Poppins-Medium',

    //fontSize: height * 0.016,
    fontSize: 12,
  },
  boldText: {
    fontSize: height * 0.023,
    fontFamily: 'Poppins-Bold',
  },
  originalPrice: {
    color: '#7C7C7C',
    textDecorationLine: 'line-through',
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.017,
    marginBottom: 5,
  },
  offTxt: {
    marginLeft: 5,
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.013,
    textAlign: 'center',
  },
  omrTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.017,
    color: '#606060',
  },
  txt: {
    color: 'rgba(0, 0, 0, 0.61)',
    marginVertical: 20,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginLeft: 7,
  },
});
