import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';

const AffiliationCard = () => {
  const {colors} = useTheme();
  const data = [
    {
      id: 1,
      title: 'Link Clicks',
      count: 84,
      description: 'Share Product links for more Referrals',
      gradientColor: 'rgba(191, 211, 81, 0.5)',
      imageSource: require('../../assets/images/hand.png'),
      action: 'Clicks',
    },
    {
      id: 2,
      title: 'Successful Purchase',
      count: 27,
      description: 'Congrats keep going!',
      gradientColor: 'rgba(40, 186, 232, 0.5)',
      imageSource: require('../../assets/images/box.png'),
      action: 'Buys',
    },
  ];

  const AffiliationItem = ({item}) => {
    const {title, count, description, gradientColor, imageSource, action} =
      item;

    return (
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        colors={['rgba(255, 255, 255, 1)', gradientColor]}
        style={styles.gradientStyle}>
        <View style={styles.itemsstyle}>
          <View>
            <Text style={[styles.affiliateText, {color: colors.primary}]}>
              {title}
            </Text>
            <Text style={[styles.moneyText, {color: colors.primary}]}>
              {count}
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',

                  fontFamily: 'Poppins-Medium',
                }}>
                {' '}
                {action}
              </Text>
            </Text>
          </View>
          <View style={styles.imgcontainer}>
            <Image
              source={imageSource}
              resizeMode="contain"
              style={{width: 85, height: 85}}
            />
          </View>
        </View>
        <View style={{height: 10}} />
        <Text
          style={{
            color: colors.primary,
            fontFamily: 'Poppins-Medium',
            fontSize: 10,
          }}>
          {description}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.maincontainer}>
      {data.map(item => (
        <AffiliationItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  affiliateText: {
    fontSize: 16,

    fontFamily: 'Poppins-Medium',
  },
  gradientStyle: {
    padding: 20,
    alignContent: 'space-around',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemsstyle: {flexDirection: 'row', justifyContent: 'space-between'},
  imgcontainer: {width: 85, height: 85, alignSelf: 'flex-end'},
  maincontainer: {},
  moneyText: {
    fontSize: 37,

    fontFamily: 'Poppins-Medium',
    marginTop: 15,
  },
});
export default AffiliationCard;
