import React, {useState, useRef, useEffect} from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Swiper from 'react-native-swiper';
import {useQuery} from '@apollo/client';
import {GET_CMS_RECORD} from '../../graphQl/queries/Queries';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {h, w} from '../../utils/PercentageToDp';

function CarouselComponent({
  height,
  pageName,
  section,
  refreshing,
  setRefreshing,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

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

  const BannerItem = ({imageUrl}) => {
    console.log(imageUrl, 'BANERE IMAGE URL')
    const [imageHeight, setImageHeight] = useState(400); // Default height

    useEffect(() => {
      if (imageUrl) {
        Image.getSize(
          imageUrl,
          (imgWidth, imgHeight) => {
            const aspectRatio = imgHeight / imgWidth;
            const calculatedHeight = width * 0.95 * aspectRatio; // Adjust height based on aspect ratio
            setImageHeight(calculatedHeight);
          },
          error => {
            console.log('Image Size Error:', error);
          },
        );
      }
    }, [imageUrl]);

    return (
      <View
        style={[
          styles.imageContainer,
          {height: imageHeight, width: width * 0.95},
        ]}>
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="contain" // Maintain aspect ratio without cropping
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, {height: height}]}>
      {isLoading ? (
        <View style={{height: height, width: width}}>
          <View style={{flex: 1, justifyContent: 'center'}}></View>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              height: height,
              width: width * 0.95,
              alignSelf: 'center',
              borderRadius: 10,
            }}
          />
        </View>
      ) : (
        // </View>
        <Carousel
          loop={true}
          width={width}
          height={height}
          autoPlay={true}
          data={images}
          autoPlayInterval={2000}
          enabled={false}
          // scrollAnimationDuration={1500}
          renderItem={({index}) => (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <BannerItem imageUrl={images[index]} />
              <View style={styles.indicatorContainer}>
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.indicator,
                      {
                        backgroundColor:
                          currentIndex === i
                            ? '#BDBDBD'
                            : 'rgba(255, 255, 255, 0.24)',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    // width: width * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
     borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 1,
    marginHorizontal: 4,
  },
});

export default CarouselComponent;
