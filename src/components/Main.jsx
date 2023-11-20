import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  StatusBar,
  StyleSheet,
  Pressable,
  // DrawerLayoutAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {t} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

import {useRoute, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {
  DrawerLayoutAndroid,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
const MainStack = createNativeStackNavigator();

import Home from './mainScreens/Home';

import ProductContext from '../context/ProductContext';

const Main = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const {cartItems, drawer, lightMode, setLightMode} =
    useContext(ProductContext);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [settingsClicked, setSettingsClicked] = useState(false);

  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);
  console.log(routeName);

  useEffect(() => {
    const showTab = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideTab = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showTab.remove();
      hideTab.remove();
    };
  }, []);

  const handleTapPress = (id, func) => {
    setActiveTab(id);
    func;
  };

  const setTheme = () => {
    setLightMode(lightMode ? false : true);
  };

  const renderDrawer = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 50,
        }}>
        <View style={{gap: 25}}>
          <Text
            style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
            SHOPPING GUIDE
          </Text>
          <Text
            style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
            MY ORDERS
          </Text>

          <Pressable
            style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
            onPress={() => setSettingsClicked(settingsClicked ? false : true)}>
            <Text
              style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
              SETTINGS
            </Text>
            <Icon
              name={settingsClicked ? 'chevron-up' : 'chevron-down'}
              color={lightMode ? '#555' : '#fff'}
            />
          </Pressable>
          <View
            style={{
              gap: 15,
              paddingLeft: 20,
              display: settingsClicked ? 'flex' : 'none',
            }}>
            <Text
              style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
              ACCOUNT SETTINGS
            </Text>
            <Text
              style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
              PAYMENT SETTINGS
            </Text>
          </View>

          <Text
            style={[styles.drawerText, {color: lightMode ? '#555' : '#fff'}]}>
            HELP CENTER
          </Text>
        </View>
        <Pressable style={{paddingBottom: 20}} onPress={() => setTheme()}>
          <Icon
            name={lightMode ? 'moon' : 'sun'}
            size={30}
            color={lightMode ? '#555' : '#fff'}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <GestureHandlerRootView
      style={[t.hFull, {backgroundColor: lightMode ? '#fff' : '#111'}]}>
      <StatusBar
        backgroundColor={lightMode ? '#fff' : '#111'}
        barStyle={lightMode ? 'dark-content' : 'light-content'}
        animated={true}
      />
      <DrawerLayout
        ref={drawer}
        drawerWidth={300}
        drawerPosition={'left'}
        renderNavigationView={renderDrawer}
        drawerBackgroundColor={lightMode ? '#fff' : '#111'}
        onDrawerSlide={() => console.log('drawn')}
        keyboardDismissMode="on-drag"
        // gestureEnabled={gestureEnabled}
        // drawerLockMode="unlocked"
      >
        <View style={[t.hFull, t.flex, t.flexCol, t.justifyBetween]}>
          {/* <ProductContextProvider> */}
          {/* <Home navigation={navigation} /> */}

          <MainStack.Navigator>
            <MainStack.Screen
              name="home"
              component={Home}
              options={{headerShown: false}}
            />
          </MainStack.Navigator>

          {/* </ProductContextProvider> */}

          {/* #ff6f61 */}
          <View
            style={[
              t.flexRow,
              t.itemsCenter,
              t.hAuto,
              t.pY5,
              // t.justifyAround,
              t.m5,
              // t.mB2,
              // t.mT2,
              t.roundedFull,
              {
                // backgroundColor: '#07172a',
                display: keyboardStatus ? 'none' : 'flex',
                marginTop: 7,
                marginBottom: 6,
                justifyContent: 'space-around',
                gap: 15,
              },
            ]}>
            <Pressable onPress={() => handleTapPress(1, null)}>
              <View>
                <Icon
                  name="house"
                  size={27}
                  color={
                    routeName == 'home'
                      ? lightMode
                        ? '#222'
                        : '#fff'
                      : lightMode
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                />
              </View>
            </Pressable>
            <Pressable onPress={() => handleTapPress(2, null)}>
              <View>
                <Icon5
                  name="th-large"
                  size={27}
                  color={
                    route.name == 'category'
                      ? '#36346C'
                      : lightMode
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleTapPress(3, navigation.navigate('cart'))}>
              <View>
                {cartItems?.length > 0 && (
                  <View
                    style={[
                      t.roundedFull,
                      t.flex,
                      t.justifyCenter,
                      t.itemsCenter,
                      // t.p3,
                      {
                        backgroundColor: '#f66464',
                        position: 'absolute',
                        height: 25,
                        width: 25,
                        bottom: 15,
                        left: 15,
                        zIndex: 10,
                      },
                    ]}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        // padding: 3,
                      }}>
                      {cartItems.length}
                    </Text>
                  </View>
                )}
                <Icon
                  name="bag-shopping"
                  size={27}
                  color={
                    route.name == 'cart'
                      ? '#36346C'
                      : lightMode
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                  solid={true}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => handleTapPress(4)}>
              <View>
                <Icon
                  name="bell"
                  size={27}
                  color={
                    lightMode
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                  solid={true}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </DrawerLayout>
    </GestureHandlerRootView>
  );
};

export default Main;

const styles = StyleSheet.create({
  drawerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#555',
  },
});
