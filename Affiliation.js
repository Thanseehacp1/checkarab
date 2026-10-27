import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import NavigationComponent from '../../../../components/postAuthComponents/NavigationComponent';
import {useTheme} from 'react-native-paper';
import AffiliationCard from '../../../../components/postAuthComponents/AffiliationCard';
import Header from '../../../../components/postAuthComponents/Header';

export default function Affiliation() {
  const {colors} = useTheme();
  return (
    <ScrollView
      style={[styles.maincontainer, {backgroundColor: colors.secondary}]}>
      <Header title={'Affiliation'} />
      <View style={{height: 10}} />
      <NavigationComponent selected={true} title="Affiliation" />
      <View style={{height: 30}} />
      <View style={styles.firstcontainer}>
        <LinearGradient
          start={{x: 0, y: 2}}
          end={{x: 1, y: 4.5}}
          colors={['rgba(255, 255, 255, 1)', 'rgba(227, 6, 19, 1)']} // 0.7 alpha makes the color slightly transparent
          style={styles.gradientstyle}>
          <View>
            <Text style={[styles.affiliateText, {color: colors.primary}]}>
              Afiliate Earnings
            </Text>
            <Text style={styles.moneyText}>
              420
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Montserrat-Regular',
                }}>
                {' '}
                AD points
              </Text>
            </Text>
          </View>
          <View style={styles.imgcontainer}>
            <Image
              source={require('../../../../assets/images/coins.png')}
              resizeMode="contain"
              style={{width: 85, height: 85}}
            />
          </View>
        </LinearGradient>
        <View style={styles.redeemTextContainer}>
          <Text style={[styles.redeemText, {color: colors.secondary}]}>
            Redeem Points
          </Text>
        </View>
      </View>
      <View style={{height: 15}} />
      <AffiliationCard />
      <Text style={[styles.dashtext, {color: colors.primary}]}>Dashboard</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  affiliateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  dashtext: {
    fontSize: 14,
    //fontWeight:"700",
    marginBottom: 60,
    marginTop: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  firstcontainer: {
    overflow: 'hidden',
  },
  gradientstyle: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F1F1F1',
  },
  imgcontainer: {
    width: 85,
    height: 85,
    alignSelf: 'flex-end',
  },
  maincontainer: {flex: 1, paddingHorizontal: 10},
  moneyText: {
    fontSize: 37,
    color: 'black',
    marginTop: 15,
    fontFamily: 'Poppins-Medium',
  },
  redeemText: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  redeemTextContainer: {
    padding: 10,
    backgroundColor: 'red',
    alignSelf: 'center',
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
