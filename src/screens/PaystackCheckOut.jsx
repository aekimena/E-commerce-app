import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {WebView} from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Theme} from '../context/themeContext';

const PaystackCheckOut = () => {
  const {currentBgColor, currentTextColor} = useContext(Theme);

  const navigation = useNavigation();

  const route = useRoute();
  const {url, checkOutInfo} = route.params;

  const callback_url = 'https://callback.com'; // your callback url in your paystack dashboard
  const cancel_url = 'http://cancelurl.com/'; // a paystack redirect url if user cancels payment

  // function to get the refrence from the callback url
  const getUrlParams = url => {
    // Parse URL parameters into a key-value object
    const params = {};
    const urlParts = url.split('?');
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const keyValuePairs = queryString.split('&');
      keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
      });
    }
    return params;
  };

  onNavigationStateChange = state => {
    const {url} = state;

    if (!url) return;

    if (url.includes(cancel_url)) {
      navigation.goBack();
      Alert.alert('Payment cancelled');
    }

    if (url.includes(callback_url)) {
      const params = getUrlParams(url);
      const extractedParam = params['reference'];
      if (extractedParam) {
        navigation.navigate('checkoutPage', {
          reference: extractedParam,
          checkOutInfoFromPaystack: checkOutInfo,
          startConfirmation: true,
        });
      }
    }

    if (url.includes('https://standard.paystack.co/close')) {
      navigation.goBack();
      Alert.alert('Payment cancelled');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: currentBgColor}}>
      <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
        <Pressable
          onPress={() => (
            navigation.goBack(), Alert.alert('Payment cancelled')
          )}
          style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Icon name="xmark" size={22} color={currentTextColor} />
          <Text style={{fontSize: 22, color: currentTextColor}}>Cancel</Text>
        </Pressable>
      </View>

      <WebView
        source={{
          uri: url,
        }}
        onNavigationStateChange={this.onNavigationStateChange}
        style={{flex: 1}}
      />
    </View>
  );
};

export default PaystackCheckOut;

const styles = StyleSheet.create({});
