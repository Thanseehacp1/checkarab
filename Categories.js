import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {SvgUri} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {useTheme} from 'react-native-paper';
import {Category2} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {GET_ACTIVE_CHILD_CATEGORIES} from '../../graphQl/queries/Queries';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {h, w} from '../../utils/PercentageToDp';

const {width, height} = Dimensions.get('window');
export default function Categories({refreshing, setRefreshing}) {
  const {colors} = useTheme();
  const navigation = useNavigation();

  
  const {loading, error, data, refetch} = useQuery(
    GET_ACTIVE_CHILD_CATEGORIES,
    {
      variables: {
        input: {
          parent: null,
        },
      },
    },
  );
  
  const isLoading = refreshing || loading;

  const records = data?.getActiveChildCategoriesInMobile?.records || [];

  // Slice the array to get the first 10 items
  const first10Items =
    records && records?.length > 0 ? records.slice(0, 10) : Array(10).fill('_');
  // console.log(data?.getActiveChildCategoriesInMobile.records, 'yy');

  const CategoryItem = ({item}) => {
    const windowWidth = Dimensions.get('window').width;
    const circleSize = windowWidth * 0.14; // 15% of window width
    const handleNavigation = () => {
      if (!refreshing) {
        navigation.navigate('Categories', {
          title: item.categoryName,
          category: item._id,
        });
      }
    };

    return (
      <>
        {isLoading ? (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={handleNavigation}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={[
                styles.circle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  backgroundColor: colors.bglight,
                  marginBottom: 12,
                },
              ]}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                height: h(3),
                width: w(8),
                marginBottom: 3,
                borderRadius: 5,
              }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{height: h(3), width: w(5), borderRadius: 5}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={handleNavigation}>
            <View
              style={[
                styles.circle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  backgroundColor: colors.bglight,
                },
              ]}>
              <SvgUri
                width={circleSize * 0.4}
                height={circleSize * 0.4}
                uri={
                  item?.categoryImage?.fileURL
                    ? item?.categoryImage?.fileURL
                    : 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/google.svg'
                }

                // style={styles.image}
              />
            </View>
            {item?.offer && (
              <View
                style={[
                  styles.offerBadge,
                  {
                    backgroundColor: colors.offrclr,
                  },
                ]}>
                <Text style={styles.offerText}> {item.offer} </Text>
              </View>
            )}
            <Text
              style={[styles.nameText, {color: colors.primary}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item?.categoryName}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  useEffect(() => {
    if (refreshing) {
      refetch().finally(() => setRefreshing(false));
    }
  }, [refreshing]);

  return (
    <View style={[styles.mainContainer, {backgroundColor: colors.secondary}]}>
      {first10Items.map((item, index) => (
        <CategoryItem key={index} item={item} />
      ))}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          marginTop: 20,
        }}>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(226, 226, 226, 1)',
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
          }}
          onPress={() =>
            navigation.navigate('Home', {screen: 'CategoriesScreen'})
          }>
          <View
            style={[styles.catcontainer, {backgroundColor: colors.lightbg}]}>
            <Category2 size="22" color={colors.primary} variant="Bold" />
            <Text style={[styles.catText, {color: colors.primary}]}>
              All Categories
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(226, 226, 226, 1)',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 2,
    width: '20%',
  },

  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  catcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  catText: {
    marginLeft: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: height * 0.0148,
  },
  offerBadge: {
    position: 'absolute',
    top: width * 0.12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    paddingHorizontal: 4,
  },
  offerText: {
    color: 'white',
    fontSize: height * 0.01,
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  nameText: {
    textAlign: 'center',
    fontSize: height * 0.0132,
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  image: {
    width: '45%',
    height: '45%',
    //borderRadius:25,
    //marginRight:20,
    //resizeMode: 'contain',
  },
});
