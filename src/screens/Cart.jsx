import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  decreaseItemQuantity,
  increaseItemQuantity,
  selectItemColor,
  selectItemSize,
  deleteCartItem,
  deleteAllCartItem,
} from '../redux/actions';
import {BottomSheet} from '../context/bottomSheetContext';
import {SelectList} from 'react-native-dropdown-select-list';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Theme} from '../context/themeContext';

const Cart = () => {
  const {currentTextColor, currentBgColor, themeColor} = useContext(Theme);
  const {refRBSheetForCart} = useContext(BottomSheet);
  const {cart} = useSelector(state => state.cartReducer);
  const dispatch = useDispatch();
  const removeCartItem = product => dispatch(deleteCartItem(product));
  const deleteAll = () => dispatch(deleteAllCartItem());
  const navigation = useNavigation();
  const totalPrice = cart.reduce((x, y) => {
    return x + y.price;
  }, 0);

  const totalItems = cart.reduce((x, y) => {
    return x + y?.quantity;
  }, 0);

  const stylesInner = StyleSheet.create({
    addMinusBtn: {
      borderColor: currentTextColor,
      borderWidth: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      width: 'auto',
      borderRadius: 5,
      width: 30,
    },

    subtotal_shipping_text: {
      fontSize: 18,
      fontWeight: '500',
      color: currentTextColor,
    },
    totalPrice_cont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    total_text: {fontSize: 20, fontWeight: 'bold', color: currentTextColor},
    checkOutBtnContainer: {
      bottom: 0,
      width: '100%',
      backgroundColor: currentBgColor,
      height: 'auto',
      padding: 15,
      borderTopWidth: 0.5,
      borderColor: currentTextColor,
      gap: 15,
    },
    checkOutBtn: {
      backgroundColor: themeColor,
      width: '100%',
      paddingVertical: 15,
      borderRadius: 10,
    },
  });

  // function to change selected color

  const changeColor = (item, color) => {
    dispatch(selectItemColor(item, color));
  };

  // function to change selected size
  const changeSize = (item, size) => {
    dispatch(selectItemSize(item, size));
  };

  const increaseQuantityState = item => {
    item.quantity == item.stock ? null : dispatch(increaseItemQuantity(item));
  };

  const decreaseQuantityState = item => {
    item.quantity == 1
      ? removeCartItem(item)
      : dispatch(decreaseItemQuantity(item));
  };

  const showDeleteAllAlert = () => {
    Alert.alert(
      'Delete all cart items.',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: deleteAll,
        },
      ],
      {cancelable: false},
    );
  };

  // this is the component that's rendered when the cart item is swiped

  const SwipeLeftAction = item => {
    return (
      <View
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          padding: 30,
        }}>
        <Pressable onPress={() => removeCartItem(item)}>
          <Icon name="trash" size={30} color="#000" />
        </Pressable>
      </View>
    );
  };

  function goToCheckOut() {
    refRBSheetForCart.current.close();
    navigation.navigate('checkoutPage');
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View
        style={[
          styles.header,
          {
            borderColor: currentTextColor,
            borderBottomWidth: 0.5,
          },
        ]}>
        <Pressable onPress={() => refRBSheetForCart.current.close()}>
          <Icon name="xmark" size={25} color={currentTextColor} />
        </Pressable>
        <View>
          <Text style={{fontSize: 25, color: currentTextColor}}>
            Cart ({totalItems})
          </Text>
        </View>
        <Pressable onPress={showDeleteAllAlert}>
          <Icon name="trash" size={25} color={currentTextColor} />
        </Pressable>
      </View>
      <ScrollView>
        {cart.map(item => (
          <Swipeable
            renderLeftActions={() => SwipeLeftAction(item)}
            friction={1}
            containerStyle={{
              borderColor: currentTextColor,
              borderBottomWidth: 0.5,

              backgroundColor: 'red',
            }}
            key={item._id}>
            <View
              style={{backgroundColor: currentBgColor, padding: 15, gap: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 150,
                  gap: 20,
                }}>
                {/*  */}
                <Image
                  source={{uri: item.image}}
                  style={{height: 120, width: 120, borderRadius: 10}}
                  resizeMode="cover"
                />
                {/*  */}
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    height: '100%',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: currentTextColor,
                      fontSize: 22,
                      fontWeight: '500',
                    }}
                    numberOfLines={1}>
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      color: currentTextColor,
                      fontSize: 20,
                      fontWeight: '500',
                    }}>
                    Stock: {item.stock}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="naira-sign"
                      size={15}
                      color={currentTextColor}
                    />
                    <Text
                      style={{
                        color: currentTextColor,
                        fontSize: 22,
                        fontWeight: 'bold',
                      }}>
                      {item.discountPrice ? item.discountPrice : item.price}
                    </Text>
                  </View>
                </View>
                {/*  */}
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    height: '100%',
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={stylesInner.addMinusBtn}
                    onPress={() => increaseQuantityState(item)}>
                    <Icon name="plus" color={currentTextColor} size={15} />
                  </Pressable>

                  <Text
                    style={{
                      color: currentTextColor,
                      fontSize: 20,
                      fontWeight: '500',
                    }}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    style={stylesInner.addMinusBtn}
                    onPress={() => decreaseQuantityState(item)}>
                    <Icon name="minus" color={currentTextColor} size={15} />
                  </Pressable>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 15,
                }}>
                <SelectList
                  setSelected={val => changeSize(item, val)}
                  data={item.sizeArrayForDropDown}
                  placeholder="Size"
                  search={false}
                  save="value"
                  maxHeight={200}
                  arrowicon={
                    <Icon
                      name="chevron-down"
                      color={currentTextColor}
                      size={20}
                    />
                  }
                  boxStyles={{
                    borderColor: currentTextColor,
                    alignItems: 'center',
                    gap: 10,
                    height: 50,
                  }}
                  dropdownStyles={{borderColor: currentTextColor}}
                  dropdownTextStyles={{color: currentTextColor, fontSize: 20}}
                  inputStyles={{color: currentTextColor, fontSize: 20}}
                />

                <View style={{flexDirection: 'row', gap: 15}}>
                  {item.colors.map((colorObj, index) => (
                    <Pressable
                      onPress={() => changeColor(item, colorObj.color)}
                      key={index}
                      style={{
                        height: 35,
                        width: 35,
                        backgroundColor: colorObj.color
                          ? colorObj.color
                          : 'transparent',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {item.selectedColor == colorObj.color && (
                        <Icon
                          name="check"
                          color={
                            colorObj.color == '#fff' ||
                            colorObj.color == 'white'
                              ? '#000'
                              : '#fff'
                          }
                          size={20}
                        />
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </Swipeable>
        ))}
      </ScrollView>
      {cart.length > 0 && (
        <View style={stylesInner.checkOutBtnContainer}>
          <View style={stylesInner.totalPrice_cont}>
            <Text style={stylesInner.total_text}>Total:</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="naira-sign" size={13} color={currentTextColor} />
              <Text style={stylesInner.total_text}>{totalPrice}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={goToCheckOut}>
            <View style={stylesInner.checkOutBtn}>
              <View style={styles.checkOut_arrow_cont}>
                <Text style={{color: '#fff', fontSize: 22}}>Checkout</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  checkOut_arrow_cont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
