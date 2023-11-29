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
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useCallback, useMemo, useRef} from 'react';
import {t, theme} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ProductContext from '../context/ProductContext';
import StarRating from 'react-native-star-rating';
// import {ScrollView} from 'react-native-gesture-handler';
import CartDisplay from './CartDisplay';

const ProductDisplay = ({navigation}) => {
  const {
    productId,
    allProducts,
    cartUpdate,
    handleNewFavouriteValue,
    theme,
    newRating,
    cartItems,
    handleAddBtn,
    handleMinusBtn,
    cartArray,
    refRBSheet,
  } = useContext(ProductContext);

  const productIndex =
    allProducts[allProducts.findIndex(obj => obj.id === productId)];
  const [activeBtn, setActiveBtn] = useState(1);
  const handlePress = id => {
    setActiveBtn(id);
  };

  const [activeSizeBtn, setActiveSizeBtn] = useState(1);
  // const [starCount, setStarCount] = useState(0);
  const handleSizeBtnPress = id => {
    setActiveSizeBtn(id);
  };
  const renderRadioBtns = (id, color) => {
    const btnBorder =
      activeBtn === id
        ? (l = theme == 'light' ? '#222' : '#fff')
        : 'transparent';

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
    const bgColor =
      activeSizeBtn === id
        ? theme == 'light'
          ? '#222'
          : '#fff'
        : 'transparent';
    const textColor =
      activeSizeBtn === id
        ? theme == 'light'
          ? '#fff'
          : '#222'
        : theme == 'light'
        ? '#222'
        : '#fff';

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
              borderColor: theme == 'light' ? '#222' : '#fff',
              borderWidth: 1,
            },
          ]}>
          <Text style={{fontSize: 17, color: textColor}}>{size}</Text>
        </Pressable>
      </View>
    );
  };

  const ratingChange = (id, rating) => {
    newRating(id, rating);
  };
  return (
    <SafeAreaView
      style={{backgroundColor: theme == 'light' ? '#fff' : '#111', flex: 1}}>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        animated={true}
        translucent={true}
      />
      <View
        style={{
          backgroundColor: theme == 'light' ? '#fff' : '#111',
          height: 110,
          justifyContent: 'center',
        }}>
        <View style={styles.topBtns}>
          <Pressable onPress={() => navigation.goBack()}>
            <View>
              <Icon
                name="arrow-left"
                color={theme == 'light' ? '#222' : '#fff'}
                size={30}
              />
            </View>
          </Pressable>
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            {cartArray?.length > 0 && (
              <TouchableOpacity
                style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}
                onPress={() => refRBSheet.current.open()}>
                <View>
                  <Icon
                    name="bag-shopping"
                    size={30}
                    color={theme == 'light' ? '#222' : '#fff'}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 25,
                    color: theme == 'light' ? '#222' : '#fff',
                  }}>
                  {cartArray.length}
                </Text>
              </TouchableOpacity>
            )}
            <View>
              <Pressable
                onPress={() =>
                  handleNewFavouriteValue(
                    productId,
                    productIndex.liked ? false : true,
                    productIndex,
                  )
                }>
                <View style={styles.topBtn}>
                  <Icon
                    name="heart"
                    size={30}
                    color={
                      productIndex.liked
                        ? '#f66464'
                        : theme == 'light'
                        ? '#222'
                        : '#fff'
                    }
                    solid={productIndex.liked ? true : false}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{height: 350}}>
          <ImageBackground
            source={productIndex.imageSource}
            resizeMode="cover"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              alignSelf: 'center',
            }}
          />
          {/* <View
            style={{
              position: 'absolute',
              zIndex: 20,
              padding: 5,
              bottom: 0,
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 10,
              alignSelf: 'center',
            }}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={productIndex.rating}
              selectedStar={rating => ratingChange(productIndex.id, rating)}
              fullStarColor={'#ffe169'}
              emptyStarColor={'#fff'}
              buttonStyle={{margin: 5, marginBottom: 0}}
            />
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
              3.2/5
            </Text>
          </View> */}
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}></View>
        </View>
        <View style={{gap: 30, paddingVertical: 20}}>
          <View style={{paddingHorizontal: 20, gap: 5}}>
            <Text
              style={{
                color: theme == 'light' ? '#222' : '#fff',
                fontSize: 30,
                fontWeight: 'bold',
              }}>
              {productIndex.title}
            </Text>
            <Text
              style={{
                color: theme == 'light' ? '#333' : '#888',
                fontSize: 27,
                fontWeight: 400,
              }}>
              <Icon name="naira-sign" size={20} />
              {productIndex.price}
            </Text>
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', gap: 15}}>
              {productIndex.sizes.map(size => (
                <View key={size.id}>{renderSizeBtns(size.id, size.size)}</View>
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', gap: 5}}>
              {productIndex.colors.map(color => (
                <View key={color.id}>
                  {renderRadioBtns(color.id, color.color)}
                </View>
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 20, gap: 10}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: theme == 'light' ? '#222' : '#fff',
              }}>
              Description
            </Text>
            <Text
              style={{
                color: theme == 'light' ? '#222' : '#fff',
                fontSize: 18,
                lineHeight: 30,
              }}>
              {productIndex.description}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 10,
              paddingHorizontal: 20,
            }}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={productIndex.rating}
              selectedStar={rating => ratingChange(productIndex.id, rating)}
              fullStarColor={'#ffe169'}
              emptyStarColor={theme == 'light' ? '#222' : '#fff'}
              buttonStyle={{margin: 5, marginBottom: 0, marginLeft: 0}}
            />
            <Text
              style={{
                color: theme == 'light' ? '#222' : '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              3.2/5
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: theme == 'light' ? '#fff' : '#111',
          height: 90,
          width: '100%',
          justifyContent: 'center',
          borderTopWidth: 0.5,
          borderTopColor: '#111',
          paddingHorizontal: 20,
        }}>
        {!cartItems.includes(productIndex.id) && (
          <TouchableOpacity onPress={() => cartUpdate(true, productIndex)}>
            <View
              style={{
                backgroundColor: '#6236FF',
                width: '100%',
                paddingVertical: 15,
                borderRadius: 50,
              }}>
              <View style={styles.addToCartBtnFlexRow}>
                <Icon name={'bag-shopping'} size={25} color="#fff" />
                <Text style={{color: '#fff', fontSize: 20}}>Add to cart</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {cartItems.includes(productIndex.id) && (
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', gap: 15}}>
              <Pressable
                style={[
                  styles.addMinusBtn,
                  {borderColor: theme == 'light' ? '#222' : '#fff'},
                ]}
                onPress={() =>
                  handleMinusBtn(
                    cartArray[
                      cartArray.findIndex(obj => obj.id == productIndex.id)
                    ],
                  )
                }>
                <Icon
                  name="minus"
                  size={20}
                  color={theme == 'light' ? '#222' : '#fff'}
                />
              </Pressable>
              <Text
                style={{
                  color: theme == 'light' ? '#222' : '#fff',
                  fontSize: 20,
                }}>
                {
                  cartArray[
                    cartArray.findIndex(obj => obj.id == productIndex.id)
                  ].quantity
                }
              </Text>
              <Pressable
                style={[
                  styles.addMinusBtn,
                  {borderColor: theme == 'light' ? '#222' : '#fff'},
                ]}
                onPress={() =>
                  handleAddBtn(
                    cartArray[
                      cartArray.findIndex(obj => obj.id == productIndex.id)
                    ],
                  )
                }>
                <Icon
                  name="plus"
                  size={20}
                  color={theme == 'light' ? '#222' : '#fff'}
                />
              </Pressable>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={() => cartUpdate(false, productIndex)}>
                <View
                  style={{
                    backgroundColor: '#6236FF',
                    width: '100%',
                    paddingVertical: 15,
                    borderRadius: 50,
                  }}>
                  <View style={styles.addToCartBtnFlexRow}>
                    <Icon name={'check'} size={25} color="#fff" />
                    <Text style={{color: '#fff', fontSize: 20}}>
                      Added to cart
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <CartDisplay navigation={navigation} />
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
      height: 45,
      width: 45,
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

    paddingTop: 25,
    paddingHorizontal: 20,
  },

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
  addMinusBtn: {
    backgroundColor: 'transparent',
    height: 30,
    width: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
