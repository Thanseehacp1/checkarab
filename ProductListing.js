import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {Add} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import AddToCart from '../productComponents/AddedToCart';
import {useMutation} from '@apollo/client';
import {useQuery} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import {ADD_TO_CART} from '../../graphQl/mutations/mutations';
import {GET_PRODUCTS} from '../../graphQl/queries/Queries';
import {useEffect} from 'react';
const {width, height} = Dimensions.get('window');

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {h, w} from '../../utils/PercentageToDp';

const ProductListing = ({
  customStyle,
  discountFilter = 0,
  showAll,
  refreshing,
  setRefreshing,
}) => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const numberOfColumns = 2;
  const containerWidth = (screenWidth - 30) / numberOfColumns;
  const {
    loading,
    error,
    data: productsData,
    refetch,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        discount: discountFilter,
        size: 41,
      },
    },
  });

  const [modal, setmodal] = useState(false);
  const [itemName, setItemName] = useState('');

  const [addToCart, {data, loading: addingToCart, error: addCartError}] =
    useMutation(ADD_TO_CART);
  const handleBackdropPress = () => {
    setmodal(false);
  };
  const handleNavigation = () => {
    setmodal(false);
    navigation.navigate('CartScreen');
  };
  const handleAddtoCart = async item => {
    try {
    if (item.stock > 0 ) {
      const {data} = await addToCart({
        variables: {
          input: {
            productId: item._id,
            quantity: 1,
          },
        },
      });
      // console.log(data, 'aaaaaddddddd');
      if (data?.addToCartInMobile.message == 'Items added to cart') {
        setItemName(item.productName);
        setmodal(true);
      }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const products = productsData?.getProductsInMobile?.records || [];

  // Determine how many products to show
  const displayedProducts = showAll ? products : products.slice(0, 6);

  const ProductItem = ({item, containerWidth}) => {
    const discountPercentage = item.mrp
      ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, {width: containerWidth}]}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            productId: item._id, // Pass the product ID
            productName: item.productName, // Pass the product name (if needed)
            productImage: item.images?.[0]?.fileURL,
            discountPercentage: discountPercentage,
            twist2: true,
          })
        }>
       {/*} {discountPercentage > 0 && (
          <Text style={styles.badgeText}> {discountPercentage}%</Text>
        )}*/}
        <View style={styles.imgContainer}>
          {item.images?.[0]?.fileURL ? (
            <Image
              source={{uri: item.images[0].fileURL}}
              style={styles.productImage}
            />
          ) : (
            <Text>No Image</Text> // Placeholder for missing image
          )}
        </View>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handleAddtoCart(item)}>
          <Add size="20" color="black" />
        </TouchableOpacity>
        <View style={styles.bottomRow}>
          <Text style={[styles.categoryText, {color: colors.tertiary}]} numberOfLines={1}>
            {item.categoryNamePath}
          </Text>
          <Text style={[styles.nameText, {color: colors.primary}]} numberOfLines={2}>
            {item.productName}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.actualPrice}>
            OMR
            <Text style={[styles.boldText, {color: colors.primary}]}>
              {'  '}
              {item.sellingPrice}
            </Text>
          </Text>
          {item.mrp && <Text style={styles.originalPrice}>{item.mrp}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const isLoading = refreshing || loading;

  useEffect(() => {
    if (refreshing) {
      refetch().finally(() => setRefreshing(false));
    }
  }, [refreshing]);

  return (
    <View>
      <View style={[styles.mainContainer, customStyle]}>
        {!isLoading &&
          displayedProducts &&
          displayedProducts?.length > 0 &&
          displayedProducts?.map(item => (
            <ProductItem
              key={item._id}
              item={item}
              containerWidth={containerWidth}
            />
          ))}

        {isLoading &&
          Array(6)
            .fill('_')
            .map((_, ind) => (
              <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
                key={ind}
                style={{
                  width: containerWidth,
                  borderWidth: 2,
                  margin: 5,
                  borderColor: '#E6E6E6',
                  height: 300,
                }}
              />
            ))}
      </View>
      <AddToCart
        isVisible={modal}
        onBackdropPress={handleBackdropPress}
        itemName={itemName}
        continueShopping={handleBackdropPress}
        handleNavigation={handleNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actualPrice: {
    color: '#606060',
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.0145,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    backgroundColor: 'green',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginBottom: 1,
  },
  boldText: {
    fontSize: height * 0.0195,
    fontFamily: 'Poppins-Medium',
  },
  categoryText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
  },
  iconContainer: {
    padding: 2,
    borderRadius: 20,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  itemContainer: {
    borderWidth: 2,
    margin: 5,
    padding: 8,
    borderColor: '#E6E6E6',
    paddingBottom: 10,
    height: 300,
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 5,
  },
  nameText: {
    marginVertical: 8,
    fontFamily: 'Poppins-Medium',
    //fontWeight:"700",
    fontSize: 12,
  },
  originalPrice: {
    color: '#606060',
    textDecorationLine: 'line-through',
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.0145,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productImage: {
    alignSelf: 'center',
    height: 110,
    resizeMode: 'contain',
    width: width * 0.25,
  },
  imgContainer: {
    height: 110,
    margin: 5,
    alignSelf: 'center',
    width: width * 0.25,
    marginVertical: 10,
  },
  centeredContent: {
    alignItems: 'center',
  },
});

export default ProductListing;
