import {
  View,
  Text,
  Keyboard,
  StatusBar,
  StyleSheet,
  Pressable,
  Dimensions,
  // DrawerLayoutAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {t} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {useRoute, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const MainStack = createNativeStackNavigator();

import Home from './mainScreens/Home';
// import Catalog from './mainScreens/Catalog';
import Favourites from './Favourites';
import CartDisplay from './CartDisplay';

import ProductContext from '../context/ProductContext';
import NewCollectionsScreen from './mainScreens/NewCollectionsScreen';
import SearchScreen from './mainScreens/SearchScreen';
import Cart from './Cart';
import {runOnJS} from 'react-native-reanimated';

const Main = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const {cartItems, drawer, theme, favouriteItems, toggleTheme, refRBSheet} =
    useContext(ProductContext);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [settingsClicked, setSettingsClicked] = useState(false);

  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route);

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
            style={[
              styles.drawerText,
              {color: theme == 'light' ? '#555' : '#fff'},
            ]}>
            SHOPPING GUIDE
          </Text>
          <Text
            style={[
              styles.drawerText,
              {color: theme == 'light' ? '#555' : '#fff'},
            ]}>
            MY ORDERS
          </Text>

          <Pressable
            style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
            onPress={() => setSettingsClicked(settingsClicked ? false : true)}>
            <Text
              style={[
                styles.drawerText,
                {color: theme == 'light' ? '#555' : '#fff'},
              ]}>
              SETTINGS
            </Text>
            <Icon
              name={settingsClicked ? 'chevron-up' : 'chevron-down'}
              color={theme == 'light' ? '#555' : '#fff'}
            />
          </Pressable>
          <View
            style={{
              gap: 15,
              paddingLeft: 20,
              display: settingsClicked ? 'flex' : 'none',
            }}>
            <Text
              style={[
                styles.drawerText,
                {color: theme == 'light' ? '#555' : '#fff'},
              ]}>
              ACCOUNT SETTINGS
            </Text>
            <Text
              style={[
                styles.drawerText,
                {color: theme == 'light' ? '#555' : '#fff'},
              ]}>
              PAYMENT SETTINGS
            </Text>
          </View>

          <Text
            style={[
              styles.drawerText,
              {color: theme == 'light' ? '#555' : '#fff'},
            ]}>
            HELP CENTER
          </Text>
        </View>
        <Pressable style={{paddingBottom: 20}} onPress={() => toggleTheme()}>
          <Icon
            name={theme == 'light' ? 'moon' : 'sun'}
            size={30}
            color={theme == 'light' ? '#555' : '#fff'}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: theme == 'light' ? '#fff' : '#111'}}>
      <StatusBar
        backgroundColor={theme == 'light' ? '#fff' : '#111'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        animated={true}
      />
      <DrawerLayout
        ref={drawer}
        drawerWidth={300}
        drawerPosition={'left'}
        renderNavigationView={renderDrawer}
        drawerBackgroundColor={theme == 'light' ? '#fff' : '#111'}
        onDrawerSlide={() => console.log('drawn')}
        keyboardDismissMode="on-drag">
        <MainStack.Navigator initialRouteName="home">
          <MainStack.Screen
            name="home"
            component={Home}
            options={{headerShown: false}}
          />
          <MainStack.Screen
            name="searchScreen"
            component={SearchScreen}
            options={{headerShown: false}}
          />
          {/* <MainStack.Screen
              name="catalog"
              component={Catalog}
              options={{headerShown: false}}
            /> */}
          <MainStack.Screen
            name="favorites"
            component={Favourites}
            options={{headerShown: false}}
          />
          <MainStack.Screen
            name="newCollections"
            component={NewCollectionsScreen}
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

            t.m5,

            t.roundedFull,
            {
              // backgroundColor: '#07172a',
              display: keyboardStatus ? 'none' : 'flex',
              marginTop: 7,
              marginBottom: 6,
              justifyContent: 'space-between',
              paddingHorizontal: 25,
              // alignSelf: 'baseline',
              // gap: 25,
            },
          ]}>
          <Pressable
            onPress={() => handleTapPress(1, navigation.navigate('home'))}>
            <View>
              <Icon
                name="house"
                size={27}
                color={
                  routeName == 'home' ||
                  routeName == 'newCollections' ||
                  routeName == 'searchScreen'
                    ? theme == 'light'
                      ? '#222'
                      : '#fff'
                    : theme == 'light'
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(255, 255, 255, 0.2)'
                }
              />
            </View>
          </Pressable>
          {/* <Pressable
              onPress={() => handleTapPress(2, navigation.navigate('catalog'))}>
              <View>
                <Icon5
                  name="th-large"
                  size={27}
                  color={
                    routeName == 'catalog'
                      ? theme == 'light'
                        ? '#222'
                        : '#fff'
                      : theme == 'light'
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                />
              </View>
            </Pressable> */}
          <Pressable
            onPress={() => handleTapPress(1, navigation.navigate('favorites'))}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            {favouriteItems?.length > 0 && (
              <View
                style={[
                  t.flex,
                  t.justifyCenter,
                  t.itemsCenter,
                  // t.p3,
                  {
                    backgroundColor: '#6236FF',
                    position: 'absolute',
                    height: 5,
                    width: 5,
                    borderRadius: 2.5,
                    top: -8.5,
                    right: -5,
                  },
                ]}></View>
            )}

            <View>
              <Icon
                name="heart"
                size={27}
                solid={true}
                color={
                  routeName == 'favorites'
                    ? theme == 'light'
                      ? '#222'
                      : '#fff'
                    : theme == 'light'
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(255, 255, 255, 0.2)'
                }
              />
            </View>
          </Pressable>

          <Pressable
            // onPress={() => handleTapPress(3, navigation.navigate('cart'))}
            onPress={() => refRBSheet.current.open()}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            {cartItems?.length > 0 && (
              <View
                style={[
                  t.flex,
                  t.justifyCenter,
                  t.itemsCenter,
                  // t.p3,
                  {
                    backgroundColor: '#6236FF',
                    position: 'absolute',
                    height: 5,
                    width: 5,
                    borderRadius: 2.5,
                    top: -8.5,
                    right: -5,
                  },
                ]}></View>
            )}
            <Icon
              name="bag-shopping"
              size={27}
              color={
                route.name == 'cart'
                  ? '#6236FF'
                  : theme == 'light'
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(255, 255, 255, 0.2)'
              }
              solid={true}
            />
          </Pressable>

          <Pressable onPress={() => handleTapPress(4)}>
            <View>
              <Icon
                name="bell"
                size={27}
                color={
                  theme == 'light'
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(255, 255, 255, 0.2)'
                }
                solid={true}
              />
            </View>
          </Pressable>
        </View>
      </DrawerLayout>
      <CartDisplay navigation={navigation} refRBSheet={refRBSheet} />
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
