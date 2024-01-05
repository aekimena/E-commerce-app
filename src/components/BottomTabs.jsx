import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Keyboard,
} from 'react-native';

import React, {useContext, useState, useEffect} from 'react';
import IconBadge from 'react-native-icon-badge';

import Icon2 from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {Theme} from '../context/themeContext';

// these are the tab icons when they're not focused
const tabIcons = {
  Home: 'home-outline',
  Settings: 'gear',
  Likes: 'heart-outline',
  homeSearch: 'search-outline',
  notifications: 'notifications-outline',
};

// these are the tab icons when they're focused
const tabIconsSolid = {
  Home: 'home',
  Settings: 'gear',
  Likes: 'heart',
  homeSearch: 'search',
  notifications: 'notifications',
};

// this is the component that would show the length of unseen notifications

const Badge = ({children}) => {
  const {themeColor} = useContext(Theme);
  const [notificaionData, setNotifications] = useState([]);
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
              setNotifications(
                response.data.filter(item => item.seen === false),
              );
            } else if (response.status == 404) {
              setNotifications([]);
            } else if (response.status == 500) {
              console.log('internal server error');
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      getNotifications();
    }, [notificaionData]),
  );
  return (
    <IconBadge
      MainElement={<View>{children}</View>}
      BadgeElement={
        <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>
          {notificaionData?.length}
        </Text>
      }
      IconBadgeStyle={{
        position: 'absolute',
        top: -7,
        right: -9,
        minWidth: 21,
        height: 21,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        display: notificaionData?.length > 0 ? 'flex' : 'none',
        backgroundColor: themeColor,
      }}
    />
  );
};

const BottomTabs = ({state, descriptors, navigation}) => {
  const {currentBgColor, currentTextColor} = useContext(Theme);
  const window = useWindowDimensions();

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  // useffect to hide bottom tab when the keyboard is active

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: currentBgColor,
        bottom: 0,
        justifyContent: 'center',
        width: window.width,
        display: keyboardStatus ? 'none' : 'flex',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            key={index}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            {tabIcons[label] == 'notifications-outline' ? (
              <Badge>
                <Icon2
                  name={isFocused ? tabIconsSolid[label] : tabIcons[label]}
                  size={27}
                  color={currentTextColor}
                />
              </Badge>
            ) : (
              <Icon2
                name={isFocused ? tabIconsSolid[label] : tabIcons[label]}
                size={27}
                color={currentTextColor}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
