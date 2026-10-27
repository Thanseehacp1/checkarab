import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, {useState,useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {Add, Heart, PercentageSquare} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';
import AddToCart from './AddedToCart';
import {useMutation,  useQuery} from '@apollo/client';
import {ADD_TO_CART, ADD_WISHLIST, REMOVE_FROM_WISHLIST} from '../../graphQl/mutations/mutations';
import SuccesToast from './SuccesToast';
import FailureToast from './/FailureToast';
import {useNavigation} from '@react-navigation/native';
import {
  RELATED_PRODUCTS,
  GET_WISHLIST,
} from '../../graphQl/queries/Queries';
const {height, width} = Dimensions.get('window');

export default function RecommendedProducts({ productId }) {
  console.log("profuctid",productId);
  const navigation = useNavigation();
  const {colors} = useTheme();
  const numberOfColumns = 2;
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = (screenWidth - 30) / numberOfColumns;
   const [successToast, setSuccessToast] = useState(false);
      const [failureToast, setFailureToast] = useState(false);
      const [toastMessage, setToastMessage] = useState('');
  const [modal, setmodal] = useState(false);
  const [itemName, setItemName] = useState('');
   const [refreshing, setRefreshing] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
  const [addToWishList, {data, loading, error}] = useMutation(ADD_WISHLIST);
  const [removeFromWishList, { loading2, error2, data2 }] = useMutation(REMOVE_FROM_WISHLIST);
  const [wishlistItems, setWishlistItems] = useState({});
  const [addToCart] = useMutation(ADD_TO_CART);
//  console.log(data, 'yyyyyyyyyyyyy', error);
  const {loading1, error1,data: data1} = useQuery(RELATED_PRODUCTS, {
   
    variables: {
      input: {
        _id:productId,
        limit: 5,
      },
    },
   
  });
  if (loading1) return <Text>Loading...</Text>;
  if (error1) return <Text>Error: {error.message}</Text>;
const {
    data: wishlist,
    loading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishList,
  } = useQuery(GET_WISHLIST);
  const products = data1?.getRelatedProductsInMobile?.records || [];
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
            productId:  item._id,
            quantity: 1,
          },
        },
      });
      if (data?.addToCartInMobile.message == 'Items added to cart') {
        setItemName(item.name);
        setmodal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
 const handlePress = async (item) => {
     const isInWishlist = wishListProducts.includes(item._id);
     //setIsPressed(newState);
     if (isInWishlist) {
       try {
        const response = await removeFromWishList({
                  variables: {
                    input: {
                      productId: item._id,
                    },
                  },
                });
                console.log('Adding to wishlist:', item._id);
                // {"data": {"removeFromMobileWishList": {"__typename": "RemoveFromMobileWishListResponse", "message": "Product removed from wishlist"}}}
                if (response?.data) {
                 // Alert.alert('Success', response?.data?.removeFromMobileWishList?.message, );
                  setSuccessToast(true);
                                    setToastMessage(response?.data?.removeFromMobileWishList?.message);
                                   setTimeout(() => { setSuccessToast(false); }, 3000);
                                   setWishListProducts(prevState => prevState.filter(id => id !== item._id));
                  refetchWishList();
                }
              } catch (err) {
                console.error('Error removing from wishlist:', err);
                //Alert.alert('Error', 'Could not remove from wishlist.');
                 setFailureToast(true);
                                         setToastMessage(err);
                                        setTimeout(() => { setFailureToast(false);}, 3000);
              }



         } else {
       try {
 const response = await addToWishList({
           variables: {
             input: {
               productId: item._id,
             },
           },
         });
         console.log(response, 'RESPONSE ADD TO WISH LIST');
         // {"data": {"addToMobileWishList": {"__typename": "AddToMobileWishListResponse", "message": "Product added to wishlist"}}}
         if (response?.data) {
           //Alert.alert('Success', response?.data?.addToMobileWishList?.message);
             setSuccessToast(true);
                                               setToastMessage(response?.data?.addToMobileWishList?.message);
                                              setTimeout(() => { setSuccessToast(false); }, 3000);
                                               setWishListProducts(prevState => [...prevState, item._id]);
           refetchWishList();
         }
       } catch (err) {
          setFailureToast(true);
                                  setToastMessage('Could not add to wishlist.');
                                 setTimeout(() => { setFailureToast(false);}, 3000);
         console.log(err);
       }
       }
     };

   console.log(JSON.stringify(wishlist?.getMobileWishListProducts?.products, 2, null), 'WISHLIST')

 //  WISH LIST
        const [wishListProducts, setWishListProducts] = useState([]);

       useEffect(() => {
         if (wishlist?.getMobileWishListProducts?.products) {
           setWishListProducts(wishlist.getMobileWishListProducts.products.map(el => el.productId));
         }
       }, [wishlist]);
 
  const renderItem = ({item}) => {
    return (

      <TouchableOpacity style={[styles.card]}
      onPress={() => navigation.navigate('ProductDetails'
       , { productId: item._id,  
        productName: item.productName,  
        productImage: item.images?.[0]?.fileURL,
        twist2:true
  })}>
      
        {item.bestSeller && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Best Seller</Text>
          </View>
        )}
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.imgContainer]}>
            <FastImage
             source={{uri: item.images[0]?.fileURL}}
              style={{width: width * 0.24, height: width * 0.37}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.wishConatiner}>
            <TouchableOpacity
              //style={[styles.circleContainer]}
           
             onPress={() => handlePress(item)}>
              <Heart size={height * 0.028}
               color={wishListProducts?.includes(item._id) ? 'red' : '#B4B4B4'}
                 variant="Bold" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomRow}>
        <Text style={[styles.categoryText, {color: colors.tertiary}]}>
          {item?.categoryNamePath?.length > 16
            ? `${item.categoryNamePath.substring(0, 16)}...`
            : item?.categoryNamePath}
        </Text>
        <Text style={[styles.nameTxt, {color: 'black'}]}>
          {item?.productName?.length > 40
            ? `${item.productName.substring(0, 40)}...`
            : item?.productName}
        </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,

            alignItems: 'center',
          }}>
          <Text style={[styles.omrTxt]}>OMR </Text>
          <Text style={[styles.boldText, {color: colors.primary}]}>
            {' '}
            {item.sellingPrice}
          </Text>
        </View>
        <Text style={styles.originalPrice}>{item.sellingPrice}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={[styles.discountContainer, {backgroundColor: '#44961D0D'}]}>
           {/*} <PercentageSquare
              size={height * 0.025}
              color="#44961D"
              variant="Bold"
            />
            <Text style={[styles.offTxt, {color: colors.offrclr}]}>
              30% OFF
            </Text>*/}
          </View>
          <TouchableOpacity
            style={[styles.circleAdd, {backgroundColor: colors.primary}]}
            onPress={() => handleAddtoCart(item)}>
            <Add size={height * 0.04} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
 
    );
  };

  return (
    <View style={{backgroundColor: colors.secondary}}>
      <Text style={[styles.recomTxt, {color: colors.primary}]}>
        Recommended for you
      </Text>
      <FlatList
      key={wishListProducts.length}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={renderItem}
        data={products}
        keyExtractor={item => item._id}
        contentContainerStyle={[styles.contentContainer]}
      />
      <AddToCart
        isVisible={modal}
        onBackdropPress={handleBackdropPress}
        itemName={itemName}
        continueShopping={handleBackdropPress}
        handleNavigation={handleNavigation}
      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: width * 0.438,
    backgroundColor: 'white',
    marginVertical: 10,
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

  contentContainer: {paddingLeft: 10},
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
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: '#E30613',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1, // Ensure the badge appears above other content
  },
  recomTxt: {
    marginLeft: 10,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',

    fontSize: height * 0.0245,
  },
  nameTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
   // fontSize: height * 0.019,
  },
  boldText: {
    fontSize: height * 0.020,
    fontFamily: 'Poppins-Medium',
  },
  categoryText: {
    fontSize: 9,
    fontFamily: 'Poppins-Medium',
   // height: 30,
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
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.013,
    textAlign: 'center',
  },
  omrTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.017,

    color: '#606060',
  },
  badgeText: {
    color: 'white',

    fontSize: height * 0.013,
    fontFamily: 'Poppins-SemiBold',
  },
  
});
