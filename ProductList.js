import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Add} from 'iconsax-react-native';
import {useTheme,Divider} from 'react-native-paper';
import AddToCart from './AddedToCart';
import FastImage from 'react-native-fast-image';
import {useMutation,useQuery} from '@apollo/client';
import {ADD_TO_CART} from '../../graphQl/mutations/mutations';
import {GET_PRODUCTS} from '../../graphQl/queries/Queries';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Header from '../../components/postAuthComponents/Header';
const {width, height} = Dimensions.get('window');

const ProductsFlatList = ({customStyle, onPress, datas,route}) => {
 // const { search, cat_id } = route.params;
 // console.log(search,"search");
 // console.log(cat_id,"cat");
  const {colors} = useTheme();
  const navigation = useNavigation();
  const numberOfColumns = 2;
  const [modal, setmodal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [addToCart, {data, loading, error}] = useMutation(ADD_TO_CART);
  const handleBackdropPress = () => {
    setmodal(false);
  };
  

  {/*const {loading: loading1, error: error1, data: data1} = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        query: search,
      }, // Passing the filter input to the query
    },
  });

  useEffect(() => {
    if (data1) {
      console.log('Fetched products:', data1.getProductsInMobile?.records);
    } else {
      console.log('No products found or error in the query.');
    }
  }, [data1]);
*/}
  const handleNavigation = () => {
    setmodal(false);
    navigation.navigate('CartScreen');
  };
  const handleAddtoCart = async item => {
    try {
      const {data} = await addToCart({
        variables: {
          input: {
            productId: item._id,
            quantity: 1,
          },
        },
      });
      console.log(data, 'aaaaaddddddd');
      if (data?.addToCartInMobile.message == 'Items added to cart') {
        setItemName(item.name);
        setmodal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ProductItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, {width: '47%'}]}
        onPress={()  => navigation.navigate('ProductDetails', { productId: item._id,  // Pass the product ID
                productName: item.productName,  // Pass the product name (if needed)
                productImage: item.images?.[0]?.fileURL,
               
               twist2:true
                })}>
              
              <View style={styles.imgContainer}>
              {item.images?.[0]?.fileURL ? (
              <Image source={{uri: item.images[0].fileURL}} style={styles.productImage} />
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
          <Text style={[styles.categoryText, {color: colors.tertiary}]}>
            {item?.categoryNamePath?.length > 16
                       ? `${item.categoryNamePath.substring(0, 16)}...`
                       : item?.categoryNamePath}
                   </Text>
                   <Text style={[styles.nameText, {color: colors.primary}]}>
                     {item?.productName?.length > 40
                       ? `${item.productName.substring(0, 40)}...`
                       : item?.productName}
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
                  {item.mrp&& <Text style={styles.originalPrice}>{item.mrp}</Text>}
                 </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.mainContainer, customStyle]}>
    
      
      <FlatList
        data={datas} 
        keyExtractor={item => item._id}
        renderItem={({item}) => <ProductItem item={item} />}
        numColumns={numberOfColumns}
        contentContainerStyle={styles.centeredContent}
      />
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
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Bold',
  },
  categoryText: {fontSize: 9, fontFamily: 'Poppins-SemiBold'},
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
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  nameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginVertical: 10,
  },
  originalPrice: {
    color: '#606060',
    textDecorationLine: 'line-through',
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: height * 0.0145,
  },
  priceRow: {alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'},
  productImage: {
    alignSelf: 'center',
    height: 110,
    resizeMode: 'contain',
    width: width * 0.32,
  },
  imgContainer: {
    height: 110,
    margin: 5,
    alignSelf: 'center',
    width: width * 0.32,
    marginVertical: 20,
  },
  centeredContent: {},
});

export default ProductsFlatList;
