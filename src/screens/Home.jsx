import {StyleSheet, View, StatusBar} from 'react-native';
import React, {useContext, useState} from 'react';

import HomeScreen from './HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Categories from './Categories';
import {Theme} from '../context/themeContext';

const Stack = createNativeStackNavigator();

const Home = () => {
  const {currentBgColor} = useContext(Theme);

  return (
    <View style={{flex: 1, backgroundColor: currentBgColor}}>
      <Stack.Navigator initialRouteName="homeScreen">
        <Stack.Screen
          name="homeScreen"
          component={HomeScreen}
          options={{headerShown: false, presentation: 'card'}}
        />
        <Stack.Screen
          name="categories"
          component={Categories}
          options={{headerShown: false, presentation: 'card'}}
        />
      </Stack.Navigator>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({});
