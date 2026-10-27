import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Home,
  DiscountShape,
  BagHappy,
  Profile,
  Category,
  ArrowDown2,
  ArrowLeft,
} from 'iconsax-react-native';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useMutation, useQuery} from '@apollo/client';
import HomeScreen from '../screens/postAuth/bottomtabs/HomeScreen';
import OffersScreen from '../screens/postAuth/bottomtabs/OffersScreen';
import CartScreen from '../screens/postAuth/bottomtabs/CartScreen';
import ProfileScreen from '../screens/postAuth/bottomtabs/ProfileScreen';
import CategoryScreen from '../screens/postAuth/bottomtabs/CategoryScreen';
import HeaderImage from '../components/preAuthComponents/HeaderImage';
import {GET_SHIPPING_ADDRESSES} from '../graphQl/queries/Queries';
const Tab = createBottomTabNavigator();
const {width, height} = Dimensions.get('window');
function BottomTabNavigator() {
  const {colors} = useTheme();
  const {token, user} = useSelector(state => state.auth) || '';
  const {data, loading, error, refetch} = useQuery(GET_SHIPPING_ADDRESSES);
  const defaultAddressLabel =
    data?.getMobileUserShippingAddresses?.address?.find(addr => addr.isDefault)
      ?.label || ' Address';

  const isLandscape = width > height;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.primary,
        tabBarLabelStyle: {
          color: colors.primary,
          paddingBottom: 14,
          fontFamily: 'Poppins-Medium',
        },
        tabBarStyle: {
          minHeight:
            Platform.OS === 'ios'?
              (isLandscape ? 60: 115): (isLandscape ? 90: 100)
        },
        tabBarItemStyle: {
          
        },
        tabBarLabelPosition: 'below-icon'
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({navigation}) => ({
          headerShadowVisible: false,
          headerShown: true,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            const isFocused = navigation.isFocused();
            return (
              <View
                style={[
                  styles.circleContainer,
                  {
                    backgroundColor: colors.lightbg,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: color,
                  },
                ]}>
                <Home variant="Bold" size={size} color={color} />
              </View>
            );
          },
          headerLeft: () => <HeaderImage />,
          title: null,
          headerStyle: {backgroundColor: colors.secondary},
          headerRight: ({size}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 5,
              }}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: colors.lightbg, borderRadius: 14},
                ]}>
                <Image
                  source={require('../assets/images/locationb.png')}
                  style={{width: 16, height: 16}}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => navigation.navigate('Addresses', {twist: true})}>
                <Text
                  style={{
                    marginHorizontal: 5,
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                    color: '#464646',
                  }}>
                  Deliver to{' '}
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Bold',
                      color: colors.primary,
                    }}>
                    {defaultAddressLabel}
                  </Text>
                </Text>
                <ArrowDown2 variant="Bold" size={19} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="OffersScreen"
        component={OffersScreen}
        options={({navigation}) => ({
          headerShown: false,
          tabBarLabel: 'Offers',
          tabBarIcon: ({color, size}) => {
            const isFocused = navigation.isFocused();
            return (
              <View
                style={[
                  styles.circleContainer,
                  {
                    backgroundColor: colors.lightbg,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: color,
                  },
                ]}>
                <DiscountShape variant="Bold" size={size} color={color} />
              </View>
            );
          },
        })}
      />
      <Tab.Screen
        name="CartScreen"
        component={token ? CartScreen : () => null}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (!token) {
              e.preventDefault(); // Prevent tab navigation
              navigation.navigate('PhoneLogin'); // Redirect to Login screen
            }
          },
        })}
        //component={CartScreen}
        options={({navigation}) => ({
          tabBarStyle: {display: 'none'},
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => {
            const isFocused = navigation.isFocused();
            return (
              <View
                style={[
                  styles.circleContainer,
                  {
                    backgroundColor: colors.lightbg,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: color,
                  },
                ]}>
                <BagHappy variant="Bold" size={size} color={color} />
              </View>
            );
          },
        })}
      />
      <Tab.Screen
        name="ProfileScreen"
        //component={ProfileScreen}
        component={token ? ProfileScreen : () => null}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (!token) {
              e.preventDefault();
              navigation.navigate('PhoneLogin');
            }
          },
        })}
        options={({navigation}) => ({
          // tabBarStyle: {display: 'none'},
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size="26" color="#000000" style={{marginLeft: 10}} />
            </TouchableOpacity>
          ),
          headerShown: true,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => {
            const isFocused = navigation.isFocused();
            return (
              <View
                style={[
                  styles.circleContainer,
                  {
                    backgroundColor: colors.lightbg,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: color,
                  },
                ]}>
                <Profile variant="Bold" size={size} color={color} />
              </View>
            );
          },
          title: 'My Profile',
          headerShadowVisible: false,
          headerTitleStyle: {fontSize: 17, fontFamily: 'Poppins-Medium'},
          headerStyle: {backgroundColor: colors.secondary},
          // headerRight: ({size}) => (
          // <TouchableOpacity
          //onPress={() => navigation.navigate('Account Details')}
          // style={[styles.chngContainer, {backgroundColor: colors.primary}]}>
          // <Text style={[styles.changtxt, {color: colors.secondary}]}>
          // Change
          // </Text>
          // </TouchableOpacity>
          //),
        })}
      />
      <Tab.Screen
        name="CategoriesScreen"
        component={CategoryScreen}
        options={({navigation}) => ({
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, size}) => {
            const isFocused = navigation.isFocused();
            return (
              <View
                style={[
                  styles.circleContainer,
                  {
                    backgroundColor: colors.lightbg,
                    borderWidth: isFocused ? 1 : 0,
                    borderColor: color,
                  },
                ]}>
                <Category variant="Bold" size={size} color={color} />
              </View>
            );
          },
        })}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  circleContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  chngContainer: {
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  changtxt: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  iconContainer: {
    width: 28,
    height: 28,

    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

export default BottomTabNavigator;
