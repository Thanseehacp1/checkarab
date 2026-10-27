import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {GET_TOP_BRANDS, GET_PRODUCTS} from '../../graphQl/queries/Queries';
import {useQuery} from '@apollo/client';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {h, w} from '../../utils/PercentageToDp';

const {width, height} = Dimensions.get('window');

export default function TopBrands({refreshing, setRefreshing}) {
  const navigation = useNavigation();
  const {loading, error, data: topBrands, refetch} = useQuery(GET_TOP_BRANDS);

  const isLoading = refreshing || loading;

  useEffect(() => {
    if (refreshing) {
      refetch().finally(() => setRefreshing(false));
    }
  }, [refreshing]);

  return (
    <ScrollView
      contentContainerStyle={styles.circleContent}
      showsHorizontalScrollIndicator={false}
      style={styles.circleContainer}
      horizontal={true}>
      {isLoading &&
        Array(6)
          .fill('')
          .map((_, index) => (
            <ShimmerPlaceHolder
              key={index}
              LinearGradient={LinearGradient}
              style={styles.image}
            />
          ))}
      {!isLoading &&
        topBrands?.getAllTopBrandRecordsInMobile?.records &&
        topBrands?.getAllTopBrandRecordsInMobile?.records?.length > 0 &&
        topBrands?.getAllTopBrandRecordsInMobile?.records?.map(
          (brand, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('TopBrandList', {brandId: brand._id})
              }>
              <FastImage
                resizeMode="contain"
                source={{
                  uri: brand.logo.fileURL
                    ? brand.logo.fileURL
                    : 'https://adspaces.sgp1.digitaloceanspaces.com/arab-deals/sandbox2/public/brand/1707295992990.png',
                  priority: FastImage.priority.normal,
                }}
                style={styles.image}
              />
            </TouchableOpacity>
          ),
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circleContainer: {},
  circleContent: {paddingLeft: 10 },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
});
