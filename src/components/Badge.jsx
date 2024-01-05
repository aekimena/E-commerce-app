import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import IconBadge from 'react-native-icon-badge';
import {useSelector} from 'react-redux';
import {Theme} from '../context/themeContext';
const Badge = ({children}) => {
  const {themeColor} = useContext(Theme);
  const {cart} = useSelector(state => state.cartReducer);
  return (
    <IconBadge
      MainElement={<View>{children}</View>}
      BadgeElement={
        <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>
          {cart?.length}
        </Text>
      }
      IconBadgeStyle={{
        position: 'absolute',
        top: -7,
        right: -9,
        minWidth: 21,
        height: 21,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        display: cart?.length > 0 ? 'flex' : 'none',
        backgroundColor: themeColor,
      }}
    />
  );
};

export default Badge;

const styles = StyleSheet.create({});
