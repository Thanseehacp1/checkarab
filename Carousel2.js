import * as React from 'react';
import {Dimensions, Image, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-reanimated-carousel';
import {useQuery} from '@apollo/client';
import {GET_CMS_RECORD} from '../../graphQl/queries/Queries';
import {useEffect} from 'react';
import {SvgUri} from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {h, w} from '../../utils/PercentageToDp';

function Carousel2({height, pageName, section, refreshing, setRefreshing}) {
  const width = Dimensions.get('window').width;
  const windowWidth = Dimensions.get('window').width;
  const bannerWidth = windowWidth * 0.95;
  const bannerheight = bannerWidth / 2.3;
  const {loading, error, data, refetch} = useQuery(GET_CMS_RECORD, {
    variables: {
      input: {pageName: pageName, sectionName: section},
    },
  });

  const images =
    data?.getCmsRecordInMobile?.record?.images?.map(img => img.fileURL) || [];

  useEffect(() => {
    if (refreshing) {
      refetch().finally(() => setRefreshing(false));
    }
  }, [refreshing]);

  const isLoading = refreshing || loading;

  return (
    <View style={[styles.container, {height: height}]}>
      <Swiper
        autoplay={true}
        loop={true}
        showsPagination={false}
        showsButtons={false}
        // dotStyle={styles.dotStyle}
        // activeDotStyle={styles.activeDotStyle}
        // paginationStyle={styles.indicatorContainer}
      >
        {isLoading && (
          <View style={{height: height, width: width}}>
            <View style={{flex: 1, justifyContent: 'center'}}></View>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                alignSelf: 'center',
                borderRadius: 10,
                height: height,
                width: width * 0.95,
              }}
            />
          </View>
        )}
        {!isLoading &&
          images &&
          images?.length > 0 &&
          images?.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              {image.endsWith('.svg') ? (
                <View
                  style={{
                    width: width,
                    height: bannerheight,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SvgUri width={width * 0.95} uri={image} />
                </View>
              ) : (
                <FastImage
                  style={[
                    styles.image,
                    {height: bannerheight, width: width * 0.95},
                  ]}
                  source={{
                    uri: images[0],
                  }}
                  resizeMode="contain"
                />
              )}
            </View>
          ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10
  },
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    width: 20,
    height: 3,
    borderRadius: 4,
    margin: 3,
  },
  activeDotStyle: {
    backgroundColor: '#BDBDBD',
    width: 20,
    height: 3,
    borderRadius: 1,
    margin: 3,
  },
  indicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -5,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //overflow: 'hidden',
    width: '100%',
    //height:'bannerheight',
    borderRadius: 10,
    // flex: 1
  },
  image: {
    // width: width*0.95,
    //height: '100%',
    //alignSelf: 'center',
    borderRadius: 10,
    // position: 'absolute',
    //resizeMode: 'cover',
  },
});

export default Carousel2;
