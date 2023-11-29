import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

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
    cartIds,
    setCartIds,
    cartArray,
    setCartArray,

    productId,
    setProductId,

    refRBSheet,
    handleAddBtn,
    handleMinusBtn,
    theme,
  } = useContext(ProductContext);

  const [totalPrice, setTotalPrice] = useState([]);
  const [totalItem, setTotalItem] = useState(0);

  const handleDisplayProduct = item => {
    refRBSheet.current.close();
    setProductId(item.id);
    navigation.navigate('ProductDisplay');
  };

  useEffect(() => {
    setTotalPrice(cartArray.map(item => item.price).reduce((x, y) => x + y, 0));
    setTotalItem(
      cartArray.map(item => item.quantity).reduce((x, y) => x + y, 0),
    );
  }, [cartArray]);

  const handleDeleteAll = () => {
    setCartIds([]);
    setCartArray([]);
  };

  const deleteItem = item => {
    cartIds.includes(item.id) &&
      setCartIds(cartIds.filter(cart => cart !== item.id));
    setCartArray(cartArray.filter(obj => obj.id !== item.id));
  };

  const renderLeftActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'red',

          justifyContent: 'center',
        }}>
        <View
          style={{
            paddingHorizontal: 30,
          }}>
          <Icon name="trash" size={30} color="#000" />
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

  return (
    <GestureHandlerRootView
      style={[
        {
          flex: 1,
          gap: 10,
          backgroundColor: theme == 'light' ? '#fff' : '#111',
        },
      ]}>
      <View style={styles.header}>
        <Pressable onPress={() => refRBSheet.current.close()}>
          <Icon
            name="xmark"
            size={25}
            color={theme == 'light' ? '#222' : '#fff'}
          />
        </Pressable>
        <View>
          <Text
            style={{fontSize: 25, color: theme == 'light' ? '#222' : '#fff'}}>
            Cart({totalItem})
          </Text>
        </View>
        <Pressable onPress={() => handleDeleteAll()}>
          <Icon5
            name="trash"
            size={25}
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
            cartArray.map(cartItem => (
              <Swipeable
                renderLeftActions={renderLeftActions}
                friction={1}
                onSwipeableOpen={() => deleteItem(cartItem)}
                key={cartItem.id}>
                <View
                  style={[
                    styles.cartContainer,
                    {
                      backgroundColor: theme == 'light' ? '#fff' : '#111',
                    },
                  ]}>
                  <GestureDetector
                    gesture={Gesture.Exclusive(singleTap(cartItem))}>
                    <View style={styles.gestureDetectorChild}>
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
                          {cartItem.price}
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
      <View
        style={[
          styles.footerContainer,
          {
            backgroundColor: theme == 'light' ? '#fff' : '#111',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}>
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
                fontSize: 25,
                color: theme == 'light' ? '#222' : '#fff',
                fontWeight: 'bold',
              }}>
              <Icon name="naira-sign" size={15} />
              {totalPrice}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#6236FF',
                  width: '100%',
                  paddingVertical: 15,
                  borderRadius: 50,
                }}>
                <View style={styles.addToCartBtnFlexRow}>
                  <Text style={{color: '#fff', fontSize: 20}}>Check Out</Text>
                  <Icon name={'arrow-right'} size={25} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  topBtn: {
    backgroundColor: 'transparent',
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    borderWidth: 1,
    borderColor: '#07172a',
  },

  addMinusBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    height: 23,
    width: 23,
    borderRadius: 8,
  },
  addToCartBtnFlexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#222',
    borderTopWidth: 0.5,
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  gestureDetectorChild: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  footerContainer: {
    height: 90,
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#111',
    paddingHorizontal: 20,
  },
});
