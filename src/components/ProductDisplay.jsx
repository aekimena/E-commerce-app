import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useCallback, useMemo, useRef} from 'react';
import {t} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ProductContext from '../context/ProductContext';
// import {ScrollView} from 'react-native-gesture-handler';

const ProductDisplay = ({navigation}) => {
  const {
    productId,
    products,
    handleNewValue,
    handleNewFavouriteValue,
    lightMode,
  } = useContext(ProductContext);

  const productIndex =
    products[products.findIndex(obj => obj.id === productId)];
  const [activeBtn, setActiveBtn] = useState(1);
  const handlePress = id => {
    setActiveBtn(id);
  };

  const [activeSizeBtn, setActiveSizeBtn] = useState(1);
  const handleSizeBtnPress = id => {
    setActiveSizeBtn(id);
  };
  const renderRadioBtns = (id, color) => {
    const btnBorder = activeBtn === id ? '#FF8119' : 'transparent';

    return (
      <View style={[styles.colorBtns, {borderColor: btnBorder}]}>
        <Pressable
          key={id}
          onPress={() => {
            handlePress(id);
          }}
          style={[styles.colorBtn, {backgroundColor: color}]}></Pressable>
      </View>
    );
  };

  const renderSizeBtns = (id, size) => {
    const bgColor = activeSizeBtn === id ? '#FF8119' : '#E2E7EE';
    const textColor = activeSizeBtn === id ? '#fff' : '#000';

    return (
      <View>
        <Pressable
          key={id}
          onPress={() => {
            handleSizeBtnPress(id);
          }}
          style={[
            styles.sizeBtn,
            {
              backgroundColor: bgColor,
            },
          ]}>
          <Text style={{fontSize: 17, color: textColor}}>{size}</Text>
        </Pressable>
      </View>
    );
  };
  return (
    <SafeAreaView style={[t.hFull, {backgroundColor: '#E2E7EE', flex: 1}]}>
      <StatusBar backgroundColor="#E2E7EE" />
      <View style={{flex: 1, backgroundColor: '#E2E7EE'}}>
        <View style={styles.topBtns}>
          <Pressable
            style={{zIndex: 20}}
            onPress={() => navigation.navigate('home')}>
            <View style={[styles.topBtn, {backgroundColor: '#36346C'}]}>
              <Icon name="chevron-left" color="#fff" size={20} />
            </View>
          </Pressable>
          <View>
            <Pressable
              style={{zIndex: 20}}
              onPress={() =>
                handleNewFavouriteValue(
                  productId,
                  productIndex.favorite ? false : true,
                  productIndex,
                )
              }>
              <View
                style={[
                  styles.topBtn,
                  {backgroundColor: '#fff', height: 55, width: 55},
                ]}>
                <Icon
                  name="heart"
                  size={20}
                  color={productIndex.favorite ? '#f66464' : '#36346c'}
                  solid={productIndex.favorite ? true : false}
                />
              </View>
            </Pressable>
          </View>
        </View>
        <ImageBackground
          source={productIndex.source}
          resizeMode="cover"
          style={{
            flex: 1,
            width: '90%',
            height: '100%',
            alignSelf: 'center',
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          backgroundColor: lightMode ? '#fff' : '#111',
          // alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'green',
          }}>
          <ScrollView
            contentContainerStyle={
              {
                // backgroundColor: 'red',
              }
            }>
            <View style={styles.detailsFlexRow}>
              <View style={{flex: 1}}>
                {/* <ScrollView contentContainerStyle={{gap: 5}}> */}
                <Text
                  style={{
                    fontSize: 27,
                    color: lightMode ? '#222' : '#fff',
                    fontWeight: 500,
                  }}>
                  {productIndex.title}
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    color: lightMode ? '#222' : '#fff',
                    fontWeight: 400,
                  }}>
                  ${productIndex.price.toFixed(2)}
                </Text>

                <View style={t.mT1}>
                  <View style={[t.flex, t.flexRow, t.mY4, {gap: 15}]}>
                    {productIndex.sizes.map(size => (
                      <View key={size.id}>
                        {renderSizeBtns(size.id, size.size)}
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[t.mT3, t.flex, t.flexCol, {gap: 10}]}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: lightMode ? '#222' : '#fff',
                      fontWeight: 500,
                    }}>
                    Description
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: lightMode ? '#222' : '#fff',
                      fontWeight: 400,
                    }}>
                    {productIndex.description}
                  </Text>
                </View>
                {/* </ScrollView> */}
              </View>
              <View>
                <View style={[t.flex, t.flexCol, t.mT3, {gap: 5}]}>
                  {productIndex.colors.map(color => (
                    <View key={color.id}>
                      {renderRadioBtns(color.id, color.color)}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <Pressable
          style={{
            // position: 'absolute',
            // bottom: 0,
            width: '100%',
          }}
          onPress={() =>
            handleNewValue(
              productId,
              productIndex.addedToCart ? false : true,
              productIndex,
            )
          }>
          <View style={[styles.addToCartBtn, {backgroundColor: '#36346C'}]}>
            <View style={styles.addToCartBtnFlexRow}>
              <Icon
                name={productIndex.addedToCart ? 'check' : 'bag-shopping'}
                size={25}
                color="#fff"
                solid={true}
              />
              <Text style={{color: '#fff', fontSize: 20}}>
                {productIndex.addedToCart ? 'Added to cart' : 'Add to cart'}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProductDisplay;

const styles = StyleSheet.create({
  colorBtns: [
    t.roundedFull,
    t.flex,
    t.justifyCenter,
    t.itemsCenter,

    {
      borderWidth: 2,
      height: 50,
      width: 50,
    },
  ],
  colorBtn: [t.roundedFull, t.h8, t.w8],

  sizeBtn: [
    t.h10,
    t.w10,
    t.justifyCenter,
    t.itemsCenter,

    {
      borderRadius: 7,
    },
  ],
  topBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
  },
  topBtn: [
    t.roundedFull,
    t.flex,
    t.justifyCenter,
    t.itemsCenter,
    {backgroundColor: '#07172a', height: 55, width: 55},
  ],
  detailsFlexRow: [
    t.flex,
    t.flexRow,
    t.justifyEvenly,
    t.itemsCenter,
    t.pX5,
    t.pY5,
    // t.mB10,
    {gap: 10},
  ],
  addToCartBtn: [
    t.m5,
    t.mB2,
    t.mT3,
    t.roundedFull,
    {
      backgroundColor: '#07172a',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
  ],
  addToCartBtnFlexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
