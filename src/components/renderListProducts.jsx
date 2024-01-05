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

import FastImage from 'react-native-fast-image';
import {Theme} from '../context/themeContext';

function RenderListProducts({item, children, index}) {
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
      onPress={() => displayProduct(item)}
      style={{flex: 1, margin: 10, marginTop: index % 2 == 0 ? 10 : 40}}>
      <FastImage
        source={{
          uri: item.image,
          priority: FastImage.priority.normal,
        }}
        style={{
          height: 200,
          width: '100%',
          borderRadius: 20,
          borderTopLeftRadius: index % 2 == 0 ? 0 : 20,
          borderBottomRightRadius: index % 2 == 0 ? 20 : 0,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 5}}>
        <View style={{gap: 5, flex: 1}}>
          <Text
            numberOfLines={1}
            style={{
              color: currentTextColor,

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
            <StarRating
              disabled={true}
              maxStars={5}
              rating={item['totalRatings'].averageRating}
              fullStarColor={'#ffe169'}
              starSize={15}
              emptyStarColor={currentTextColor}
              containerStyle={{justifyContent: 'flex-start', gap: 5}}
            />
            <Text style={{color: currentTextColor, fontSize: 15}}>
              {item['totalRatings'].totalUsers}
            </Text>
          </View>
          {/* this is to check if the price is a discount price or not */}
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
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default RenderListProducts;
