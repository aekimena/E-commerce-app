import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useContext} from 'react';
import Cart from './Cart';
import RBSheet from 'react-native-raw-bottom-sheet';
import ProductContext from '../context/ProductContext';
const CartDisplay = ({navigation, refRBSheet}) => {
  const {theme} = useContext(ProductContext);
  return (
    <RBSheet
      ref={refRBSheet}
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
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
          height: Dimensions.get('window').height,
        },
      }}>
      <Cart navigation={navigation} />
    </RBSheet>
  );
};

export default CartDisplay;

const styles = StyleSheet.create({});
