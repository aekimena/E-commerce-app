// this component is used to check if a token exists before navigating to main screen

import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'core-js/stable/atob';
import BootSplash from 'react-native-bootsplash';

const FindToken = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          // this shouldn't be here. this should be in another app
          if (decoded.role == 'admin') {
            navigation.replace('orderScreenForAdmin');
          } else {
            navigation.replace('mainScreens');
          }
        } else {
          navigation.replace('onboarding');
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    checkLoginStatus().finally(async () => {
      await BootSplash.hide({fade: true});
    });
  }, []);
};

export default FindToken;

const styles = StyleSheet.create({});
