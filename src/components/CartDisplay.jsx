// this is the bottom sheet to dispay cart

import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useContext} from 'react';
import Cart from '../screens/Cart';
import RBSheet from 'react-native-raw-bottom-sheet';
import {BottomSheet} from '../context/bottomSheetContext';
import {Theme} from '../context/themeContext';
const CartDisplay = () => {
  const {theme} = useContext(Theme);
  const {refRBSheetForCart} = useContext(BottomSheet);
  return (
    <RBSheet
      ref={refRBSheetForCart}
      closeOnDragDown={true}
      closeOnPressMask={true}
      animationType="slide"
      dragFromTopOnly={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
        draggableIcon: {
          backgroundColor: theme == 'light' ? '#222' : '#fff',
        },
        container: {
          backgroundColor: theme == 'light' ? '#fff' : '#111',
          height: Dimensions.get('window').height - 10,
        },
      }}>
      <Cart />
    </RBSheet>
  );
};

export default CartDisplay;

const styles = StyleSheet.create({});
