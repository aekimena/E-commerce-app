import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {BottomSheet} from '../context/bottomSheetContext';
import {useNavigation} from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Badge from './Badge';
import {Theme} from '../context/themeContext';

const Header = ({name, showCart}) => {
  const {currentTextColor} = useContext(Theme);
  const {refRBSheetForCart} = useContext(BottomSheet);
  const navigation = useNavigation();

  return (
    <View style={[styles.header]}>
      <View style={styles.name_BackBtn}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name={'arrow-left'} color={currentTextColor} size={25} />
        </TouchableOpacity>

        <Text
          style={{
            color: currentTextColor,
            fontSize: 22,
          }}>
          {name}
        </Text>
      </View>

      {showCart && (
        <TouchableOpacity onPress={() => refRBSheetForCart.current.open()}>
          <Badge>
            <Icon2 name="cart-outline" size={30} color={currentTextColor} />
          </Badge>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  name_BackBtn: {
    flexDirection: 'row',
    gap: 15,
    flex: 1,
    alignItems: 'center',
  },
});
