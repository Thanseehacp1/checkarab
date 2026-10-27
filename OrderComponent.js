import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  import {useTheme} from 'react-native-paper';
  import {AddCircle, MinusCirlce, Trash} from 'iconsax-react-native';
  import FastImage from 'react-native-fast-image';
  import { useNavigation } from '@react-navigation/native';
  const {height, width} = Dimensions.get('window');
  export default function OrderComponent({
    cartItems,
    handleaddition,
    handleSubstraction,
    handleRemove,
    
  }) {
    const {colors} = useTheme();
    const navigation = useNavigation();  // Use this to get the navigation object
   
   {/*} const onProductPress = (item) => {
      // Navigate to the ProductDetails screen and pass the product item
      navigation.navigate('ProductDetails', { productId: item.productId,  // Pass the product ID
        productName: item.name,  // Pass the product name (if needed)
        productImage: item.images?.[0]?.fileURL,
        //discountPercentage:item.discountPercentage,
       twist2:true
        });
    };*/}
   
    const data = [
        {
          id: '1',
          name: 'iPhone 14 Pro max 256GB Deep Purple',
          image: require('../../assets/dummyImages/small.png'),
          category: 'SMART PHONE',
         orderDate: '12 / 2 / 2023',
          price: 256,
          shippingStatus: 'Shipped',
        },
        {
          id: '2',
          name: 'iPhone 14 Pro max 256GB Deep Purple',
          image: require('../../assets/dummyImages/small.png'),
          category: 'SMART PHONE',
          orderDate: '12 / 2 / 2023',
          price: 256,
          shippingStatus: 'Shipped',
        },
      ];
    const OrderCard = ({item}) => {
     
      return (
         <View
         style={styles.cardContainer}>
          <View style={styles.rowContainer}>
            <View
              style={[styles.imgContainer, {backgroundColor: colors.lightbg}]}>
              <Image source={ uri= item.image}
                style={styles.image}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={[styles.name, {color: colors.primary}]}>
              {item.name && item.name.length > 35
              ? `${item.name.substring(0, 35)}...`
              : item.name}
              </Text>
              <Text style={styles.price}>OMR {item.price}</Text>
               <Text style={[styles.dateAndStatus, {color: colors.primary}]}>
                            {item.orderDate}{' '}</Text>
                            <Text style={[styles.statusTxt,]}>
                          Status: {item.shippingStatus}
                            </Text>
                          
              <View
                style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
               {/*} <View
                  style={[
                    styles.iconcontainer,
                    {backgroundColor: colors.lightbg},
                  ]}>
                  <TouchableOpacity onPress={() => handleSubstraction(item)}>
                    <MinusCirlce
                      size="24"
                      color={colors.primary}
                      variant="Bold"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.countText, {color: colors.primary}]}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity onPress={() => handleaddition(item)}>
                    <AddCircle size="24" color={colors.primary} variant="Bold" />
                  </TouchableOpacity>
                </View>*/}
                <TouchableOpacity onPress={() => handleRemove(item)}>
                  <Image
                    source={require('../../assets/images/trash.png')}
                    style={{height: 28, width: 28, borderRadius: 14,marginRight:20}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
  
      );
    };
  
    return (
      <View>
        {data.map((item, index) => (
           <TouchableOpacity  key={index} onPress={() => onProductPress(item) }>
          <OrderCard  item={item}  />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    circleContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
    },
  
    countText: {
      fontFamily: 'Poppins-Medium',
      marginHorizontal: 15,
      fontSize: 16,
    },
  
    maincontainer: {flex: 1},
    rowContainer: {
      flexDirection: 'row',
    },
    iconcontainer: {
      flexDirection: 'row',
      padding: 3,
      borderRadius: 15,
      alignItems: 'center',
    },
    imgContainer: {
      height: 96,
      width: 96,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      height: 60,
      width: 60,
      resizeMode: 'contain',
    },
    infoContainer: {
      marginLeft: 10,
      flex: 1,
      justifyContent: 'space-between',
    },
  
    name: {
      fontSize: 15,
      fontFamily: 'Poppins-SemiBold',
    },
  
    price: {
      fontSize: 13,
      color: '#6A6A6A',
      fontFamily: 'Poppins-SemiBold',
    },
    cardContainer: {
      width: '100%',
      padding: 10,
    },
  });
  