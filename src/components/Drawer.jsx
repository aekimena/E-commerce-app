import {StyleSheet, Text, View, Pressable, ToastAndroid} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Theme} from '../context/themeContext';

const RenderTexts = ({text, icon}) => {
  const {currentTextColor} = useContext(Theme);
  const stylesInner = StyleSheet.create({
    textStyle: {
      fontSize: 20,
      fontWeight: '500',
      color: currentTextColor,
    },
  });
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <Icon2 name={icon} size={25} color={currentTextColor} />
      <Text style={stylesInner.textStyle}>{text}</Text>
    </View>
  );
};

const RenderDrawer = ({userName, dataLoading}) => {
  const {toggleTheme, currentTextColor, theme} = useContext(Theme);
  const navigation = useNavigation();

  const stylesInner = StyleSheet.create({
    info_container: {
      backgroundColor: theme == 'light' ? '#F2F1F3' : '#222',
      width: '100%',
      height: 'auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 15,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{gap: 20}}>
        <Pressable
          style={stylesInner.info_container}
          onPress={() => navigation.navigate('userPage')}>
          <View style={{gap: 10}}>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: currentTextColor,
              }}>
              <Icon name="user" color={currentTextColor} size={20} />
            </View>
            <View>
              {!dataLoading ? (
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  {userName}
                </Text>
              ) : (
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 25,
                  }}>
                  ...
                </Text>
              )}
            </View>
          </View>
          <Icon name="chevron-right" color={currentTextColor} size={25} />
        </Pressable>
        <View
          style={[
            stylesInner.info_container,
            {flexDirection: 'column', gap: 30, alignItems: 'flex-start'},
          ]}>
          <Pressable onPress={() => navigation.navigate('MyOrders')}>
            <RenderTexts text={'My Orders'} icon={'receipt-outline'} />
          </Pressable>

          <RenderTexts text={'Shopping Guide'} icon={'compass-outline'} />

          <RenderTexts
            text={'Become a seller'}
            icon={'arrow-up-circle-outline'}
          />

          <RenderTexts text={'Help Center'} icon={'help-circle-outline'} />
        </View>
      </View>
      <View style={[stylesInner.info_container, {paddingVertical: 20}]}>
        <Pressable onPress={toggleTheme}>
          <Icon
            name={theme == 'light' ? 'moon' : 'sun'}
            size={30}
            color={currentTextColor}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default RenderDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  drawerText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
