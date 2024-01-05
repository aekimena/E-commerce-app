import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomTabs from '../BottomTabs';
import Likes from '../../screens/Likes';
import Home from '../../screens/Home';
import HomeSearchScreen from '../../screens/HomeSearchScreen';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RenderDrawer from '../Drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationsScreen from '../../screens/NotificationsScreen';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import notifee, {EventType} from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import {GeneralContext} from '../../context/generalContext';
import {Theme} from '../../context/themeContext';

const Tab = createBottomTabNavigator();

const MainScreens = () => {
  const {drawer} = useContext(GeneralContext);
  const {currentBgColor, theme} = useContext(Theme);
  const [userData, setUserData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const navigation = useNavigation();

  // get user data
  useEffect(() => {
    const getData = async () => {
      try {
        setDataLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          await axios
            .get(`http://localhost:8000/users/${userId}`)
            .then(response => {
              if (response.status === 200) {
                setUserData(response.data);
                setDataLoading(false);
              }
            })
            .catch(error => {
              if (error.response.status === 404) {
                console.log('something went wrong');
                setDataLoading(false);
              } else if (error.response.status === 500) {
                console.log('internal server error');
                setDataLoading(false);
              }
            });
        }
      } catch (error) {
        console.log(error);
        setDataLoading(false);
      }
    };
    getData();
  }, []);

  // navigate to orders screen when push notification is pressed
  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          if (
            detail.notification.android.channelId === 'order-cancelled' ||
            'order-delivered' ||
            'order-received'
          ) {
            navigation.navigate('MyOrders');
          }
          console.log('User pressed notification', detail.notification.android);
          await notifee.cancelNotification(detail.notification.id);
          break;
      }
    });
  }, []);

  // find out which notification opened the app
  useEffect(() => {
    async function getInitialNotification() {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        if (initialNotification.notification.android.channelId === 'orders') {
          navigation.navigate('MyOrders');
        }
      }
    }
    getInitialNotification();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        backgroundColor={currentBgColor}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
      />
      <DrawerLayout
        ref={drawer}
        drawerWidth={300}
        drawerPosition={'left'}
        renderNavigationView={() => (
          <RenderDrawer
            dataLoading={dataLoading}
            userName={
              userData.firstName !== undefined &&
              userData.lastName !== undefined
                ? userData?.firstName + ' ' + userData?.lastName
                : '...'
            }
          />
        )}
        drawerBackgroundColor={currentBgColor}
        onDrawerSlide={() => null}
        keyboardDismissMode="on-drag">
        <Tab.Navigator tabBar={props => <BottomTabs {...props} />}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="homeSearch"
            component={HomeSearchScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Likes"
            component={Likes}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="notifications"
            component={NotificationsScreen}
            options={{headerShown: false}}
          />
        </Tab.Navigator>
      </DrawerLayout>
    </GestureHandlerRootView>
  );
};

export default MainScreens;

const styles = StyleSheet.create({});
