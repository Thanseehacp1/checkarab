import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity, View} from 'react-native';
import {ArrowLeft} from 'iconsax-react-native';
import useStore from '../zustand/store';

//PreAuth
import Login from '../screens/preAuth/Login';
import LoginWithPhone from '../screens/preAuth/LoginWithPhone';
import OTPSubmitScreen from '../screens/preAuth/OTPverification';

// ProfileStack
import Addresses from '../screens/postAuth/screens/profileStack/Addresses';
import Affiliation from '../screens/postAuth/screens/profileStack/Affiliation';
import Orders from '../screens/postAuth/screens/profileStack/Orders';
import Add_Address from '../screens/postAuth/screens/profileStack/Add_Address';
import AccountDetails from '../screens/postAuth/screens/profileStack/AccountDetails';
import WishList from '../screens/postAuth/screens/profileStack/WishList';
import CloseAccount from '../screens/postAuth/screens/profileStack/CloseAccount';
//Others
import BottomTabNavigator from './BottomTabNavigator';
import SearchPage from '../screens/postAuth/screens/others/SearchPage';
import Coupons from '../screens/postAuth/screens/others/Coupons';
import SearchComponent from '../components/postAuthComponents/SearchComponent';
import HeaderImage from '../components/preAuthComponents/HeaderImage';
import BestSellScreen from '../components/postAuthComponents/BestSellScreen';
import ProductListing from '../components/postAuthComponents/ProductListing';
import BestSellingList from '../components/postAuthComponents/BestSellingList';
import NewProductList from '../components/postAuthComponents/NewProductList';
import SearchList from '../components/productComponents/SearchList';
import ReturnPolicy from '../components/postAuthComponents/ReturnPolicy';
import WarrantyPolicy from '../components/postAuthComponents/WarrantyPolicy';
import ReturnOrder from '../components/postAuthComponents/ReturnOrder';
import WarrantyOrder from '../components/postAuthComponents/WarrantyOrder';
//ProductsStack
import Category from '../screens/postAuth/products/Category';
import SubCategory from '../screens/postAuth/products/SubCategory';
import SelectVariant from '../screens/postAuth/products/SelectVariant';
import SelectBrand from '../screens/postAuth/products/SelectBrand';
import BrandsScreen from '../screens/postAuth/products/BrandsScreen';
import TopBrandList from '../screens/postAuth/products/TopBrandList';
import ProductDetails from '../screens/postAuth/products/ProductDetails';
import {useSelector} from 'react-redux';

import {useNetInfo} from '@react-native-community/netinfo';
import NoConnectivity from '../components/NoConnectivity';

const Stack = createNativeStackNavigator();

export default function () {
  const {type, isConnected} = useNetInfo();
  // const [isLoading, setIsLoading] = useState(true);

  const {colors} = useTheme();
  // const user = useStore(state => state);
  const {token, user, logoutFlag} = useSelector(state => state.auth) || '';

  return (
    <>
      {isConnected === false ? (
        <NoConnectivity />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: colors.secondary,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 17,
            },
          }}>
          {!token && (
            <>
              {!logoutFlag && (
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
              )}
              <Stack.Screen
                name="PhoneLogin"
                component={LoginWithPhone}
                options={({navigation}) => ({
                  headerShown: true,
                  headerLeft: () => (
                    <View style={{padding: 10, marginTop: 14}}>
                      <HeaderImage />
                    </View>
                  ),
                  title: null,
                  headerRight: () => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#F9F8F8',
                        borderRadius: 25,
                        padding: 10,
                        marginTop: 6,
                        alignSelf: 'flex-end',
                      }}
                      onPress={() => navigation.navigate('Home')}>
                      <Icon name="close" size={22} color="#292D32" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="OTP"
                component={OTPSubmitScreen}
                options={({navigation}) => ({
                  headerShown: true,
                  title: null,
                  headerLeft: () => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#F9F8F8',
                        borderRadius: 25,
                        padding: 10,
                        alignSelf: 'flex-end',
                        marginTop: 5,
                      }}
                      onPress={() => navigation.goBack()}>
                      <ArrowLeft size="24" color="#292D32" />
                    </TouchableOpacity>
                  ),
                })}
              />
            </>
          )}
          {/* {token && ( */}
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={BottomTabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Addresses" component={Addresses} />
            <Stack.Screen name="Affiliation" component={Affiliation} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen
              name="Coupons"
              component={Coupons}
              options={{title: 'Coupon Code'}}
            />
            <Stack.Screen name="Add Address" component={Add_Address} />
            <Stack.Screen name="Account Details" component={AccountDetails} />
            <Stack.Screen
              name="BestSellScreen"
              component={BestSellScreen}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="BestSellingList"
              component={BestSellingList}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="NewProductList"
              component={NewProductList}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="Wishlist"
              component={WishList}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchList"
              component={SearchList}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TopBrandList"
              component={TopBrandList}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Categories" component={Category} />
            <Stack.Screen name="ReturnPolicy" component={ReturnPolicy} />
            <Stack.Screen name="ReturnOrder" component={ReturnOrder} />
            <Stack.Screen name="WarrantyPolicy" component={WarrantyPolicy} />
            <Stack.Screen name="WarrantyOrder" component={WarrantyOrder} />
            <Stack.Screen
              name="SubCategories"
              component={SubCategory}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            {/* <Stack.Screen
        name="Variant"
        component={SelectVariant}
        options={{
          headerRight: () => <SearchComponent mright={true} />,
        }}
      />*/}
            <Stack.Screen
              name="SelectBrand"
              component={SelectBrand}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="BrandsScreen"
              component={BrandsScreen}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            {/*<Stack.Screen
        name="ProductListing"
        component={ProductListing}
        options={{
          headerRight: () => <SearchComponent mright={true} />,
        }}
      />*/}
            <Stack.Screen
              name="CloseAccount"
              component={CloseAccount}
              options={{
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
            <Stack.Screen
              name="ProductDetails"
              component={ProductDetails}
              options={{
                headerTitle: '',
                headerRight: () => <SearchComponent mright={true} />,
              }}
            />
          </Stack.Group>
          {/* )} */}
        </Stack.Navigator>
      )}
    </>
  );
}
