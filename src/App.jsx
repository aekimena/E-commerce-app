import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MainScreens from './components/main/MainScreens';
import ProductDisplay from './screens/ProductDisplay';
import CartDisplay from './components/CartDisplay';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import VerificationScreen from './screens/VerificationScreen';
import UserPage from './screens/UserPage';

import BottomSheetContext from './context/bottomSheetContext';
import store from './redux/store';
import {Provider} from 'react-redux';
import CheckOutPage from './screens/CheckOutPage';

import PaystackCheckOut from './screens/PaystackCheckOut';

import OrderScreenForAdmin from './Admin/OrderScreenForAdmin';
import OrderDisplay from './Admin/OrderDisplay';
import MyOrderScreen from './screens/MyOrderScreen';
import MyOrderDetailScreen from './screens/MyOrderDetailScreen';
import Onboarding from './screens/Onboarding';
import FindToken from './screens/FindToken';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import ThemeContext from './context/themeContext';
import GeneralContextProvider from './context/generalContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  // useffect to update device token if it changed
  useEffect(() => {
    messaging().onTokenRefresh(async newToken => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;

          await axios
            .post('http://localhost:8000/refreshToken', {
              userId: userId,
              newToken: newToken,
            })
            .then(response => {
              if (response.status == 200) {
                console.log('token changed');
              } else {
                console.log('token failed to change', error);
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <ThemeContext>
        <GeneralContextProvider>
          <BottomSheetContext>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="findToken">
                <Stack.Screen
                  name="findToken"
                  component={FindToken}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="login"
                  component={LoginScreen}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name="register"
                  component={RegistrationScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="verify"
                  component={VerificationScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="mainScreens"
                  component={MainScreens}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name="productDisplay"
                  component={ProductDisplay}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name="userPage"
                  component={UserPage}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="checkoutPage"
                  component={CheckOutPage}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="paystackCheckout"
                  component={PaystackCheckOut}
                  options={{headerShown: false}}
                />

                <Stack.Screen
                  name="orderScreenForAdmin"
                  component={OrderScreenForAdmin} // this should be in another app
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="orderDisplay"
                  component={OrderDisplay} // this should be in another app
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="MyOrders"
                  component={MyOrderScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="myOrderDetail"
                  component={MyOrderDetailScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="onboarding"
                  component={Onboarding}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
              <CartDisplay />
            </NavigationContainer>
          </BottomSheetContext>
        </GeneralContextProvider>
      </ThemeContext>
    </Provider>
  );
}

export default App;
