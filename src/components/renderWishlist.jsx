import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

import StarRating from 'react-native-star-rating';
import {useNavigation} from '@react-navigation/native';

import {Theme} from '../context/themeContext';

export default function RenderWishlist({item, children, index}) {
  const {currentTextColor} = useContext(Theme);
  const navigation = useNavigation();

  const window = useWindowDimensions();

  const styleInner = StyleSheet.create({
    strikedPrice: {
      color: currentTextColor,
      fontWeight: '400',
      fontSize: 22,
    },
    lineThrough: {
      backgroundColor: currentTextColor,
      height: 2,
      width: '100%',
      position: 'absolute',
    },
    productPrice: {
      color: currentTextColor,
      fontWeight: '500',
      fontSize: 20,
    },
  });

  function displayProduct(item) {
    navigation.navigate('productDisplay', {
      item: item,
      productId: item._id,
      title: item.title,
      price: item.price,
      discountPrice: item.discountPrice,
      isDealActive: item.isDealActive,
      image: item.image,
      material: item.details.material,
      condition: item.details.condition,
      brand: item.details.brand,
      colors: item.details.colors,
      sizes: item.details.sizes,
      description: item.description,
      averageRating: item['totalRatings'].averageRating,
    });
  }

  return (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => displayProduct(item)}>
      <View style={styles.productChildContainer}>
        <Image
          source={{
            uri: item.image,
          }}
          style={{height: '100%', width: 120, borderRadius: 10}}
          resizeMode="cover"
        />
        <View style={{gap: 10, flex: 1}}>
          <Text
            numberOfLines={1}
            style={{
              color: currentTextColor,
              fontWeight: 500,
              fontSize: 20,
            }}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
            <View style={{flex: 0}}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={item['totalRatings'].averageRating}
                fullStarColor={'#ffe169'}
                starSize={20}
                emptyStarColor={currentTextColor}
                containerStyle={{justifyContent: 'flex-start', gap: 5}}
              />
            </View>

            <Text
              style={{color: currentTextColor, fontSize: 18, flex: 1}}
              numberOfLines={1}>
              {item['totalRatings'].totalUsers}
            </Text>
          </View>
          {!item.isDealActive && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="naira-sign" size={15} color={currentTextColor} />
              <Text style={styleInner.productPrice}>{item.price}</Text>
            </View>
          )}
          {item.isDealActive && (
            <View
              style={{flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="naira-sign" size={12} color={currentTextColor} />
                  <Text style={styleInner.strikedPrice}>{item.price}</Text>
                </View>

                <View style={styleInner.lineThrough}></View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="naira-sign" size={15} color={currentTextColor} />
                <Text style={styleInner.productPrice}>
                  {item.discountPrice}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: 'row',

    height: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  productChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    height: '100%',

    flex: 1,
  },
});
