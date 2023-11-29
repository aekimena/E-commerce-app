import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useContext, useState} from 'react';
import ProductContext from '../../context/ProductContext';

const renderDrawer = () => {
  const {theme, toggleTheme} = useContext(ProductContext);
  const [settingsClicked, setSettingsClicked] = useState(false);
  return (
    <View style={styles.container}>
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

export default renderDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  drawerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#555',
  },
});
