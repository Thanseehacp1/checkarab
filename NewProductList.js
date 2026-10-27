import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
   ActivityIndicator
} from 'react-native';
import {Add} from 'iconsax-react-native';
import {useTheme,Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import AddToCart from '../productComponents/AddedToCart';
import {useMutation} from '@apollo/client';
import { useQuery } from '@apollo/client';
import {CloseCircle} from 'iconsax-react-native';
import Header from '../postAuthComponents/Header';
import {ADD_TO_CART} from '../../graphQl/mutations/mutations';
import {GET_PRODUCTS} from '../../graphQl/queries/Queries';
import {useRoute} from '@react-navigation/native';
import {Filter, Sort} from 'iconsax-react-native';
import FilterProducts from '../productComponents/Filter';
const {width, height} = Dimensions.get('window');


const NewProductList = ({customStyle, showAll }) => {
    const route = useRoute();
  const discountFilter = route.params?.discountFilter || 0
  const navigation = useNavigation();
  const {colors} = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const numberOfColumns = 2;
  const containerWidth = (screenWidth - 30) / numberOfColumns;
  //new modal========>
    const [showFilter,setShowFilter]=useState(false);
  const [variables,setVariables]=useState({
   input:{
   "discount":discountFilter,
  "size":50,
 
   }
 },);
  //new======
  const {loading, error, data: productsData} = useQuery(GET_PRODUCTS, {
    variables: variables
  }); 
 useEffect(() => {console.log("varrrrrr",variables)},[variables])
   const [sortOrder, setSortOrder] = useState(null); // Tracks sorting order
  const [isModalVisible, setIsModalVisible] = useState(false); // Controls modal visibility
  const [modal, setmodal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [visible, setVisible] = useState(false);
  const [addToCart, {data, loading: addingToCart, error:addCartError}] = useMutation(ADD_TO_CART);
  const handleBackdropPress = () => {
    setmodal(false);
  };
  const handleNavigation = () => {
    setmodal(false);
    navigation.navigate('CartScreen');
  };
  const handleSort = (order) => {
    setSortOrder(order);
    setVariables((prev) => ({
      ...prev,
      input: {
        ...prev.input,
        priceHighToLow: order === 'highToLow' ? true : null,
      priceLowToHigh: order === 'lowToHigh' ? true : null,
      },
    }));
    setIsModalVisible(false); // Close modal after selection
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
  if (loading &&  !showFilter)  {
                                                return (
                                                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <ActivityIndicator size="small" color={colors.primary} />
                                                  </View>
                                                );
                                              }
  if (error) {
    console.error('Error details:', error);
    return <Text>Error fetching products: {error.message}</Text>;
  }
  const products = productsData?.getProductsInMobile?.records || [];
//console.log(products,"&&&&&&&&&&&&")
  // Determine how many products to show
  const displayedProducts = showAll ? products : products.slice(0, 6);

 
  const ProductItem = ({item, containerWidth}) => {
    const discountPercentage = item.mrp
    ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
    : 0;
return (
    <TouchableOpacity
      style={[styles.itemContainer, {width: containerWidth}]}
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id,  // Pass the product ID
        productName: item.productName,  // Pass the product name (if needed)
        productImage: item.images?.[0]?.fileURL,
        discountPercentage:discountPercentage,
       twist2:true
        })}>
      {/*} {discountPercentage > 0 && (
             <Text style={styles.badgeText}> {discountPercentage}%</Text>

             )}*/}
      <View style={styles.imgContainer}>
      {item.images?.[0]?.fileURL ? (
      <Image source={{uri: item.images[0].fileURL}} style={styles.productImage} />
    ) : (
      <Text>No Image</Text> // Placeholder for missing image
    )}
      </View>
      {item?.stock > 0 && (
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => handleAddtoCart(item)}>
        <Add size="20" color="black" />
      </TouchableOpacity>
      )}
      <View style={styles.bottomRow}>
        <Text style={[styles.categoryText, {color: colors.tertiary}]}>
          {item?.categoryNamePath?.length > 16
            ? `${item.categoryNamePath.substring(0, 16)}...`
            : item?.categoryNamePath}
        </Text>
        <Text style={[styles.nameText, {color: colors.primary}]}>
          {item.productName.length > 40
            ? `${item.productName.substring(0, 40)}...`
            : item.productName}
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
   
    <View style={{flex:1,backgroundColor:"#fff"}}>
    <Header  horizontal={10} />
    <Divider style={{marginVertical: 5}} />
    <ScrollView contentContainerStyle={[styles.mainContainer, {backgroundColor: colors.secondary}]}
    >
      
      {products.map(item => (
          <ProductItem
            key={item._id}
            item={item}
            containerWidth={containerWidth}
          />
        ))}
       </ScrollView>
       <View style={{ height: 10 }} /> 
      
      <AddToCart
        isVisible={modal}
        onBackdropPress={handleBackdropPress}
        itemName={itemName}
        continueShopping={handleBackdropPress}
        handleNavigation={handleNavigation}
      />
       <Modal
 // animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
 
>
<View style={styles.modalContainer}>
<View style={styles.modalContent}>
    <View style={[styles.header]}>
      <Text style={styles.resetTxt}>Sort By </Text>
<CloseCircle
              size="30"
              color="#9E9E9E"
              variant="Bold"
              onPress={() => setIsModalVisible(false)}
            />
          </View>
      <TouchableOpacity
        style={[styles.optionButton, sortOrder === 'lowToHigh' ]}
        onPress={() => handleSort('lowToHigh')}
      >
          <View style={styles.optionRow}>
           <Text style={styles.optionText}>Price Low - High</Text>
                  <View
                    style={[
                      styles.dotCircle,
                      { backgroundColor: sortOrder === 'lowToHigh' ? 'black' : '#ccc' },
                    ]}
                  />

                </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, sortOrder === 'highToLow']}
        onPress={() => handleSort('highToLow')}
      >
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Price High - Low</Text>
                 <View
                   style={[
                     styles.dotCircle,
                     { backgroundColor: sortOrder === 'highToLow' ? 'black' : '#ccc' },
                   ]}
                 />

               </View>
      </TouchableOpacity>

     {/*} <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>*/}
    </View>
  </View>
</Modal>
       <View style={[styles.footer]}>
         <TouchableOpacity style={[styles.container1]} onPress={() => setIsModalVisible(true)}>
          
           <Sort size="24" color="#474747" />
           <Text style={[styles.txt]}>Sort</Text>
         </TouchableOpacity>
         <View style={styles.border}></View>
         <TouchableOpacity
          //onPress={()=>navigation.navigate('Filter')}
        onPress={() => setShowFilter(true)}
          style={[styles.container1]}>
           <Filter size="24" color="#474747" />
           <Text style={[styles.txt]}>Filter</Text>
         </TouchableOpacity>
       </View> 
       {showFilter&& <FilterProducts setVariables={setVariables} variables={variables} setShowFilter={setShowFilter} showFilter={showFilter} itemscount={productsData?.getProductsInMobile?.maxRecords}/>} 
    </View>
     
  );
};

const styles = StyleSheet.create({
  actualPrice: {
    color: '#606060',
    fontFamily: 'Poppins-Regular',
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
    height:300
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding:5
  },
  nameText: {
    marginVertical: 8,
    fontFamily: 'Poppins-Medium',
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
  border: {
    width: 1,
    height: '100%',
    backgroundColor: '#bababa',
  },
  container1: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:"white"
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor:"#fff"
  },
  txt: {
    marginLeft: 5,
    fontSize: 12,
    color: '#474747',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'white',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    //padding: 20,
    borderRadius: 10,
    margin:0,
    paddingVertical: 15,
   // flexDirection: 'row',
    //justifyContent: 'space-between',
    //paddingHorizontal: 12,
    //alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    width: '100%',
    //alignItems: 'center',
    //borderBottomWidth: 1,
   // borderBottomColor: '#ccc',
  },
  resetTxt: {fontFamily: 'Poppins-Medium', fontSize: 16, color: '#000'},
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    color: '#333333',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: -3,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: 'red',
  },
   optionRow: {
      flexDirection: 'row',
      justifyContent:'space-between',
    },
    dotCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 10,
    },
});

export default NewProductList;
