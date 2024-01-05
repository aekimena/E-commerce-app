import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef, useState} from 'react';

export const Theme = React.createContext();

const ThemeContext = ({children}) => {
  const [theme, setTheme] = useState('light');
  const currentBgColor = theme == 'light' ? '#fff' : '#111';
  const currentTextColor = theme == 'light' ? '#222' : '#fff';
  const themeColor = '#6236FF';
  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme('light');
      }
    } catch (error) {
      console.error('Error loading theme from AsyncStorage:', error);
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme).catch(error => {
      console.error('Error saving theme to AsyncStorage:', error);
    });
  };

  async function clearItem() {
    try {
      await AsyncStorage.removeItem('authToken');
      console.log('removed');
    } catch (error) {
      console.log('error');
    }
  }

  //   clearItem();
  return (
    <Theme.Provider
      value={{
        theme,
        setTheme,
        currentBgColor,
        currentTextColor,
        loadTheme,
        toggleTheme,
        themeColor,
      }}>
      {children}
    </Theme.Provider>
  );
};

export default ThemeContext;
