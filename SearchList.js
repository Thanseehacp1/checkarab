import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {Add} from 'iconsax-react-native';
import {useTheme,Divider} from 'react-native-paper';
import AddToCart from './AddedToCart';
import FastImage from 'react-native-fast-image';
import {useMutation,useQuery} from '@apollo/client';
import {ADD_TO_CART} from '../../graphQl/mutations/mutations';
import {GET_PRODUCTS} from '../../graphQl/queries/Queries';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FilterProducts from '../../components/productComponents/Filter';
import Header from '../../components/postAuthComponents/Header';
const {width, height} = Dimensions.get('window');
import {Filter, Sort} from 'iconsax-react-native';
import {CloseCircle} from 'iconsax-react-native';
const SearchList = ({customStyle, onPress, datas,route}) => {
  const { search, cat_id } = route.params;
 console.log(search,"search");
  console.log(cat_id,"cat");
  const {colors} = useTheme();
  const navigation = useNavigation();
  const numberOfColumns = 2;
  const [modal, setmodal] = useState(false);
    const [sortOrder, setSortOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [addToCart, {data, loading, error}] = useMutation(ADD_TO_CART);
   const [showFilter,setShowFilter]=useState(false);
  const handleBackdropPress = () => {
    setmodal(false);
  };
   const [variables,setVariables]=useState({
     input:{
     query: search,

     }
   },);

  const {loading: loading1, error: error1, data: data1} = useQuery(GET_PRODUCTS, {
    variables: variables
  });

  useEffect(() => {
    if (data1) {
      console.log('Fetched products:', data1.getProductsInMobile?.records);
    } else {
      console.log('No products found or error in the query.');
    }
  }, [data1]);

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
            {item.categoryNamePath.length > 16
                       ? `${item.categoryNamePath.substring(0, 16)}...`
                       : item.categoryNamePath}
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
    <View style={[styles.mainContainer, customStyle,{backgroundColor: colors.secondary}]}>
     <Header  horizontal={10} />
    <Divider style={{marginVertical: 5}} />
     {/*} <View style={{height:20}}/>*/}
      <FlatList
        data={data1?.getProductsInMobile?.records || []} 
        keyExtractor={item => item._id}
        renderItem={({item}) => <ProductItem item={item} />}
        numColumns={numberOfColumns}
        contentContainerStyle={styles.centeredContent}
      />
      <View style={{height:20}}/>
      <AddToCart
        isVisible={modal}
        onBackdropPress={handleBackdropPress}
        itemName={itemName}
        continueShopping={handleBackdropPress}
        handleNavigation={handleNavigation}
      />
       <View>
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
        </View>
                 <View style={[styles.footer]}>
                   <TouchableOpacity style={[styles.container1]}
                     onPress={() => setIsModalVisible(true)}>
                     <Sort size="24" color="#474747" />
                     <Text style={[styles.txt]}>Sort</Text>
                   </TouchableOpacity>
                   <View style={styles.border}></View>
                   <TouchableOpacity
 onPress={() => setShowFilter(true)}
                    style={[styles.container1]}>
                     <Filter size="24" color="#474747" />
                     <Text style={[styles.txt]}>Filter</Text>
                   </TouchableOpacity>
                 </View>
  {showFilter&& <FilterProducts setVariables={setVariables} variables={variables} setShowFilter={setShowFilter} showFilter={showFilter} itemscount={data1?.getProductsInMobile?.maxRecords}/>}
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
    fontSize: 8,
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
  categoryText: {fontSize: 9, fontFamily: 'Poppins-Bold'},
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
    fontFamily: 'Poppins-SemiBold',
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
 footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor:"#fff"
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
  centeredContent: {},
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

export default SearchList;
