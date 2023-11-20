import {View, Text, Image, Pressable} from 'react-native';
import React, {useContext} from 'react';
import {t} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ProductContext from '../context/ProductContext';

const Products = ({navigation}) => {
  const {
    productId,
    lightMode,
    setProductId,
    handleNewValue,
    handleNewFavouriteValue,
    filteredProducts,
  } = useContext(ProductContext);
  const handleDisplayProduct = product => {
    setProductId(product.id);
    navigation.navigate('ProductDisplay');
    console.log(productId);
  };

  return filteredProducts.map(product => (
    <Pressable
      style={{
        width: '50%',

        marginBottom: 5,
      }}
      key={product.id}
      onPress={() => handleDisplayProduct(product)}>
      <View style={{padding: 5}}>
        <Image
          source={product.source}
          style={{
            width: '100%',
            height: 200,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          resizeMode="contain"
        />

        <Pressable
          style={[
            t.absolute,
            t.top2,
            t.right0,

            t.h8,
            t.w8,
            t.m3,
            t.roundedFull,
            t.itemsCenter,
            t.justifyCenter,
            t.flexCol,
            {backgroundColor: '#f7fafc'},
          ]}
          onPress={() =>
            handleNewFavouriteValue(
              product.id,
              product.favorite ? false : true,
              product,
            )
          }>
          <Icon
            name="heart"
            size={20}
            color={product.favorite ? '#f66464' : '#36346C'}
            solid={product.favorite ? true : false}
          />
        </Pressable>
        <Pressable
          style={[
            t.absolute,
            t.top0,
            t.left0,

            t.h8,
            t.w8,
            t.m3,
            t.roundedFull,
            t.itemsCenter,
            t.justifyCenter,
            t.flexCol,
            {backgroundColor: '#fff'},
          ]}
          onPress={() =>
            handleNewValue(
              product.id,
              product.addedToCart ? false : true,
              product,
            )
          }>
          <Icon
            name={product.addedToCart ? 'check' : 'plus'}
            size={20}
            color={'#36346C'}
            solid={false}
          />
        </Pressable>

        <View
          style={[
            t.p2,
            t.flexCol,
            t.justifyBetween,
            t.roundedBLg,
            {
              backgroundColor: lightMode ? '#fff' : '#222',
              height: 90,
              elevation: 1,
            },
          ]}>
          <Text
            style={{color: lightMode ? '#222' : '#fff', fontSize: 18}}
            numberOfLines={2}
            lineBreakMode="tail">
            {product.title}
          </Text>
          <Text style={{color: lightMode ? '#222' : '#fff', fontSize: 17}}>
            ${product.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  ));
};

export default Products;
