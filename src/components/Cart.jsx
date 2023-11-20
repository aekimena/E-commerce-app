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

const Cart = ({navigation}) => {
  const {
    products,
    cartItems,
    setCartItems,
    handleNewValue,
    productId,
    setProductId,
    handleNewQuantityValue,
    handleNewPriceValue,
    lightMode,
  } = useContext(ProductContext);

  const [totalPrice, setTotalPrice] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [cartBgCol, setCartBgCol] = useState('transparent');

  const handleDisplayProduct = product => {
    setProductId(product.id);
    navigation.navigate('ProductDisplay');
    console.log(productId);
  };

  const singleTap = product =>
    Gesture.Tap()
      .maxDuration(250)
      .onStart(() => {
        setCartBgCol('rgba(7, 23, 42, 0.02)'), handleDisplayProduct(product);
      })
      .onEnd(() => setCartBgCol('transparent'));
  useEffect(() => {
    setTotalPrice(
      cartItems
        .map(item => item.price)
        .reduce((x, y) => x + y, 0)
        .toFixed(2),
    );
    setTotalItem(
      cartItems.map(item => item.quantity).reduce((x, y) => x + y, 0),
    );
  }, [cartItems]);

  const handleDeleteAll = () => {
    products.map(product => handleNewValue(product.id, false, product));
    setCartItems([]);
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

  const deleteItem = (id, item) => {
    handleNewValue(id, false, item);
    console.log(id);
  };

  const renderLeftActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: lightMode
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

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {backgroundColor: lightMode ? '#fff' : '#111'},
      ]}>
      <StatusBar
        backgroundColor={lightMode ? '#fff' : '#111'}
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        animated={true}
      />
      <View style={styles.header}>
        <Pressable
          style={[styles.topBtn, {borderColor: lightMode ? '#222' : '#fff'}]}
          onPress={() => navigation.navigate('main')}>
          <Icon
            name="chevron-left"
            size={20}
            color={lightMode ? '#222' : '#fff'}
          />
        </Pressable>
        <View>
          <Text style={{fontSize: 25, color: '#111'}}>Cart({totalItem})</Text>
        </View>
        <Pressable
          style={[styles.topBtn, {borderColor: lightMode ? '#222' : '#fff'}]}
          onPress={() => handleDeleteAll()}>
          <Icon5
            name="trash-alt"
            size={20}
            color={lightMode ? '#222' : '#fff'}
          />
        </Pressable>
      </View>
      {/*  */}
      <View
        style={{
          flex: 1,
          backgroundColor: lightMode ? '#fff' : '#111',
          marginTop: 15,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {cartItems?.length > 0 &&
            cartItems.map(cartItem => (
              <Swipeable
                renderLeftActions={renderLeftActions}
                friction={1}
                onSwipeableOpen={() => deleteItem(cartItem.id, cartItem)}
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
                        source={cartItem.source}
                        resizeMode="contain"
                        style={{height: 110, width: 110, borderRadius: 10}}
                      />

                      <View
                        style={{
                          gap: 10,

                          flex: 1,
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 500,
                            color: lightMode ? '#222' : '#fff',
                          }}
                          numberOfLines={1}>
                          {cartItem.title}
                        </Text>
                        {/* <Text style={{fontSize: 17}}>{cartItem.category}</Text> */}
                        <Text
                          style={{
                            fontSize: 25,
                            fontWeight: 600,
                            color: lightMode ? '#222' : '#fff',
                          }}>
                          ${cartItem.price.toFixed(2)}
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
                          backgroundColor: lightMode
                            ? 'rgba(7, 23, 42, 0.05)'
                            : 'rgba(68, 68, 68, 0.3)',
                        },
                      ]}
                      onPress={() => handleAddBtn(cartItem)}>
                      <Icon
                        name="plus"
                        size={15}
                        color={lightMode ? '#222' : '#fff'}
                      />
                    </Pressable>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: lightMode ? '#222' : '#fff',
                      }}>
                      {cartItem.quantity}
                    </Text>
                    <Pressable
                      style={[
                        styles.addMinusBtn,
                        {
                          backgroundColor: lightMode
                            ? 'rgba(7, 23, 42, 0.05)'
                            : 'rgba(68, 68, 68, 0.3)',
                        },
                      ]}
                      onPress={() => handleMinusBtn(cartItem)}>
                      <Icon
                        name="minus"
                        size={15}
                        color={lightMode ? '#222' : '#fff'}
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
              color: lightMode ? '#222' : '#fff',
              fontSize: 17,
              fontWeight: 500,
            }}>
            Total price
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: lightMode ? '#222' : '#fff',
              fontWeight: 'bold',
            }}>
            ${totalPrice}
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
