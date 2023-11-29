import {View, Keyboard, StyleSheet, Pressable} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useRoute, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Home from './mainScreens/Home';
import Favourites from './Favourites';
import CartDisplay from './CartDisplay';
import ProductContext from '../context/ProductContext';
import NewCollectionsScreen from './mainScreens/NewCollectionsScreen';
import SearchScreen from './mainScreens/SearchScreen';
import renderDrawer from './mainScreens/Drawer';

const MainStack = createNativeStackNavigator();

const Main = ({navigation}) => {
  const {cartIds, drawer, theme, favouriteItems, refRBSheet} =
    useContext(ProductContext);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

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

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: theme == 'light' ? '#fff' : '#111'}}>
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

        <View
          style={[
            styles.footerTab,

            {
              display: keyboardStatus ? 'none' : 'flex',
            },
          ]}>
          <Pressable onPress={() => navigation.navigate('home')}>
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

          <Pressable
            onPress={() => navigation.navigate('favorites')}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            {favouriteItems?.length > 0 && (
              <View style={styles.UnemptyIndicator}></View>
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
            onPress={() => refRBSheet.current.open()}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            {cartIds?.length > 0 && (
              <View style={styles.UnemptyIndicator}></View>
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

          <Pressable>
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
  UnemptyIndicator: {
    backgroundColor: '#6236FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 5,
    width: 5,
    borderRadius: 2.5,
    top: -8.5,
    right: -5,
  },
  footerTab: {
    marginTop: 7,
    marginBottom: 6,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
