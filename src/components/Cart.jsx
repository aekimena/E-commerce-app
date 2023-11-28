import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {t} from 'react-native-tailwindcss';
import ProductContext from '../context/ProductContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';

const Cart = ({navigation}) => {
  const {
    allProducts,
    cartItems,
    setCartItems,
    cartArray,
    setCartArray,
    handleNewValue,
    productId,
    setProductId,
    handleNewQuantityValue,
    handleNewPriceValue,
    theme,
  } = useContext(ProductContext);

  const [totalPrice, setTotalPrice] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [cartBgCol, setCartBgCol] = useState('transparent');

  const handleDisplayProduct = item => {
    setProductId(item.id);
    navigation.navigate('ProductDisplay');
  };

  useEffect(() => {
    setTotalPrice(
      cartArray
        .map(item => item.price)
        .reduce((x, y) => x + y, 0)
        .toFixed(2),
    );
    setTotalItem(
      cartArray.map(item => item.quantity).reduce((x, y) => x + y, 0),
    );
  }, [cartArray]);

  const handleDeleteAll = () => {
    setCartItems([]);
    setCartArray([]);
  };

  const handleAddBtn = item => {
    item.quantity < item.stock
      ? (handleNewQuantityValue(item.id, item.quantity + 1),
        handleNewPriceValue(item.id, (item.price += item.increaseAmount)))
      : null;
  };
  const handleMinusBtn = item => {
    item.quantity > 1
      ? (handleNewQuantityValue(item.id, item.quantity - 1),
        handleNewPriceValue(item.id, (item.price -= item.increaseAmount)))
      : null;
  };

  const deleteItem = item => {
    // handleNewValue(false, item.id);
    // setCartArray(cartArray.filter(cart => cart.id !== item.id));
    cartItems.includes(item.id) &&
      setCartItems(cartItems.filter(cart => cart !== item.id));
    setCartArray(cartArray.filter(obj => obj.id !== item.id));
  };

  const renderLeftActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            theme == 'light'
              ? 'rgba(7, 23, 42, 0.02)'
              : 'rgba(68, 68, 68, 0.2)',

          justifyContent: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: 30,
          }}>
          <Icon name="trash" size={30} color="#555" />
        </View>
      </View>
    );
  };

  const singleTap = item =>
    Gesture.Tap()
      .numberOfTaps(1)
      .maxDuration(0.3)
      .onEnd(() => {
        runOnJS(handleDisplayProduct)(item);
      });
  // .onEnd(() => {
  //   runOnJS(setCartBgCol)('transparent');
  // });

  // const renderedCartItem = cartItem => {
  //   return allProducts[allProducts.findIndex(obj => obj.id == cartItem)];
  // };

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {backgroundColor: theme == 'light' ? '#fff' : '#111'},
      ]}>
      <StatusBar
        backgroundColor={theme == 'light' ? '#fff' : '#111'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        animated={true}
        translucent={false}
      />
      <View style={styles.header}>
        <Pressable
          style={[
            styles.topBtn,
            {borderColor: theme == 'light' ? '#222' : '#fff'},
          ]}
          onPress={() => navigation.navigate('main')}>
          <Icon
            name="chevron-left"
            size={20}
            color={theme == 'light' ? '#222' : '#fff'}
          />
        </Pressable>
        <View>
          <Text
            style={{fontSize: 25, color: theme == 'light' ? '#222' : '#fff'}}>
            Cart({totalItem})
          </Text>
        </View>
        <Pressable
          style={[
            styles.topBtn,
            {borderColor: theme == 'light' ? '#222' : '#fff'},
          ]}
          onPress={() => handleDeleteAll()}>
          <Icon5
            name="trash-alt"
            size={20}
            color={theme == 'light' ? '#222' : '#fff'}
          />
        </Pressable>
      </View>
      {/*  */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme == 'light' ? '#fff' : '#111',
          marginTop: 15,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {cartArray?.length > 0 &&
            // allProducts
            //   .filter(item => cartItems.includes(item.id))
            cartArray.map(cartItem => (
              <Swipeable
                renderLeftActions={renderLeftActions}
                friction={1}
                onSwipeableOpen={() => deleteItem(cartItem)}
                key={cartItem.id}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor:
                      cartItem.id == productId ? cartBgCol : 'transparent',
                    gap: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}>
                  <GestureDetector
                    gesture={Gesture.Exclusive(singleTap(cartItem))}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 15,
                        flex: 1,
                      }}>
                      <Image
                        source={cartItem.imageSource}
                        resizeMode="contain"
                        style={{height: 110, width: 110, borderRadius: 10}}
                      />

                      <View
                        style={{
                          gap: 10,

                          flex: 1,
                        }}>
                        {/* <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 500,
                            color: theme == 'light' ? '#222' : '#fff',
                          }} */}
                        <Text
                          style={{
                            color: theme == 'light' ? '#222' : '#fff',
                            fontWeight: 'bold',
                            fontSize: 20,
                          }}
                          numberOfLines={1}>
                          {cartItem.title}
                        </Text>

                        <Text
                          style={{
                            color: theme == 'light' ? '#555' : '#999',
                            fontWeight: 'bold',
                            fontSize: 20,
                          }}>
                          <Icon name="naira-sign" size={15} />
                          {cartItem.price.toFixed(2)}
                        </Text>
                        <Text
                          style={{
                            color: theme == 'light' ? '#555' : '#999',
                            fontSize: 16,
                            fontWeight: 500,
                          }}>
                          Available stock: {cartItem.stock}
                        </Text>
                      </View>
                    </View>
                  </GestureDetector>

                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 15,
                      marginRight: 10,
                    }}>
                    <Pressable
                      style={[
                        styles.addMinusBtn,
                        {
                          backgroundColor:
                            theme == 'light'
                              ? 'rgba(7, 23, 42, 0.05)'
                              : 'rgba(68, 68, 68, 0.3)',
                        },
                      ]}
                      onPress={() => handleAddBtn(cartItem)}>
                      <Icon
                        name="plus"
                        size={15}
                        color={theme == 'light' ? '#222' : '#fff'}
                      />
                    </Pressable>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: theme == 'light' ? '#222' : '#fff',
                      }}>
                      {cartItem.quantity}
                    </Text>
                    <Pressable
                      style={[
                        styles.addMinusBtn,
                        {
                          backgroundColor:
                            theme == 'light'
                              ? 'rgba(7, 23, 42, 0.05)'
                              : 'rgba(68, 68, 68, 0.3)',
                        },
                      ]}
                      onPress={() => handleMinusBtn(cartItem)}>
                      <Icon
                        name="minus"
                        size={15}
                        color={theme == 'light' ? '#222' : '#fff'}
                      />
                    </Pressable>
                  </View>
                </View>
              </Swipeable>
            ))}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <View>
          <Text
            style={{
              color: theme == 'light' ? '#222' : '#fff',
              fontSize: 17,
              fontWeight: 500,
            }}>
            Total price
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: theme == 'light' ? '#222' : '#fff',
              fontWeight: 'bold',
            }}>
            <Icon name="naira-sign" size={22} />
            {totalPrice}
          </Text>
        </View>
        <View
          style={[
            t.roundedFull,
            {
              paddingVertical: 16,
              paddingHorizontal: 25,
              backgroundColor: '#36346c',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
            },
          ]}>
          <Text style={{color: '#fff', fontSize: 20}}>Check Out</Text>
          <View>
            <Icon name="arrow-right" color="#fff" size={20} />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    gap: 10,
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  topBtn:
    //   t.roundedFull,
    //   t.flex,
    //   t.justifyCenter,
    //   t.itemsCenter,
    {
      backgroundColor: 'transparent',
      height: 55,
      width: 55,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 27.5,
      borderWidth: 1,
      borderColor: '#07172a',
    },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    // paddingTop: 5,
    paddingHorizontal: 20,
    // backgroundColor: '#000',
  },
  addMinusBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    height: 23,
    width: 23,
    borderRadius: 8,
  },
});
