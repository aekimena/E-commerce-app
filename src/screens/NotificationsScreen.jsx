import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {Theme} from '../context/themeContext';
import {useFocusEffect} from '@react-navigation/native';

const NotificationsList = ({item}) => {
  const {currentTextColor, theme} = useContext(Theme);

  return (
    <View
      style={{
        backgroundColor: theme == 'light' ? '#F8F8F8' : '#222',
        borderColor: currentTextColor,
        height: 'auto',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
        borderRadius: 10,
        gap: 10,
      }}>
      <Text style={{color: currentTextColor, fontSize: 22, fontWeight: 'bold'}}>
        {item.header}
      </Text>
      <Text
        style={{
          color: currentTextColor,
          fontSize: 20,
          fontWeight: '500',
          lineHeight: 25,
        }}
        numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={{color: currentTextColor, fontSize: 14, fontWeight: '400'}}>
        {item.timestamp}
      </Text>
    </View>
  );
};

const NotificationsScreen = () => {
  const {currentBgColor, currentTextColor} = useContext(Theme);
  const [notifications, setNotifications] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };
  useEffect(() => {
    const getNotifications = async () => {
      try {
        setDataLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const response = await axios.get(
            `http://localhost:8000/users/${userId}/notifications`,
          );
          if (response.status == 200) {
            setNotifications(response.data);
            setDataLoading(false);
          } else if (response.status == 404) {
            setNotifications([]);
            setDataLoading(false);
          } else if (response.status == 500) {
            showToastWithGravity('Server error');
            setDataLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, []);

  // update notifications on every mount
  useFocusEffect(
    React.useCallback(() => {
      const getNotifications = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            const response = await axios.get(
              `http://localhost:8000/users/${userId}/notifications`,
            );
            if (response.status == 200) {
              setNotifications(response.data);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      getNotifications();
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: currentBgColor}}>
      <View
        style={{
          borderColor: currentTextColor,
          borderBottomWidth: 0.5,
          paddingBottom: 15,
        }}>
        <Header name="Notifications" showCart={false} />
      </View>

      {notifications?.length == 0 && !dataLoading && (
        <Text style={{color: currentTextColor, fontSize: 20}}>
          No Notifications to show
        </Text>
      )}
      {dataLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={currentTextColor} size={30} />
        </View>
      )}
      {!dataLoading && (
        <FlatList
          contentContainerStyle={{padding: 15, gap: 15}}
          data={notifications}
          keyExtractor={item => item._id}
          renderItem={({item}) => <NotificationsList {...{item}} />}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
