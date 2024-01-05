import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {reusableStyles} from '../components/styles';
import ListProduct from '../components/renderWishlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {Theme} from '../context/themeContext';

const Likes = () => {
  const {currentTextColor, currentBgColor} = useContext(Theme);
  const navigation = useNavigation();
  const [arrayToUse, setArrayToUse] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [text, setText] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [unlikeProduct, setUnlikeProduct] = useState(null);

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };
  const getData = async () => {
    try {
      setDataLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const response = await axios.get(
          `http://localhost:8000/users/${userId}/likedProducts`,
        );

        if (response.status == 200) {
          setDataLoading(false);
          setArrayToUse(response.data);
        } else if (response.status == 404) {
          setDataLoading(false);
          showToastWithGravity('Something went wrong');
        } else if (response.status == 500) {
          setDataLoading(false);
          showToastWithGravity('Server error');
        }
      }
    } catch (error) {
      console.log(error);
      setDataLoading(false);
    }
  };

  // useffect to get all user's liked products
  useEffect(() => {
    getData();
  }, []);

  // useffect to get all user's liked products everytime the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            const response = await axios.get(
              `http://localhost:8000/users/${userId}/likedProducts`,
            );

            if (response.status == 200) {
              setArrayToUse(response.data);
            }
          }
        } catch (error) {
          console.log('error', error);
        }
      };
      getData();
    }, []),
  );

  // function to like/unlike product
  const like_Unlike_Product = async ({item}) => {
    try {
      setArrayToUse(arrayToUse.filter(product => product._id !== item._id));
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        const response = await fetch('http://localhost:8000/likeProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: decoded.userId,
            productId: item._id,
          }),
        });

        if (response.status == 200) {
          showToastWithGravity('Added to wishlist');
        } else if (response.status == 201) {
          showToastWithGravity('Removed from wishlist');
        } else {
          showToastWithGravity('Something went wrong');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{backgroundColor: currentBgColor, flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          gap: 10,
          borderColor: currentTextColor,
          borderBottomWidth: 0.2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            flex: 1,
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" color={currentTextColor} size={25} />
          </Pressable>

          {searchActive && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <Icon2
                name="search"
                size={25}
                color={currentTextColor}
                style={{position: 'absolute', zIndex: 10, marginLeft: 10}}
              />
              <View style={{flex: 1}}>
                <TextInput
                  style={[
                    styles.searchBar,
                    {
                      borderColor: currentTextColor,
                      color: currentTextColor,
                    },
                  ]}
                  placeholder="Search likes..."
                  onChangeText={newText => setText(newText)}
                  defaultValue={text}
                  placeholderTextColor={currentTextColor}
                  autoFocus={true}
                />
              </View>
            </View>
          )}

          {!searchActive && (
            <Text
              style={{
                color: currentTextColor,
                fontSize: 22,
              }}>
              My Wishlist
            </Text>
          )}
        </View>
        <Pressable onPress={() => setSearchActive(!searchActive)}>
          <Icon2
            name={searchActive ? 'close' : 'search'}
            color={currentTextColor}
            size={25}
          />
        </Pressable>
      </View>

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

      {arrayToUse?.length == 0 && !dataLoading && (
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: currentTextColor,
            fontSize: 17,
            flex: 1,
          }}>
          Whislist is empty
        </Text>
      )}

      {!dataLoading && arrayToUse?.length > 0 && (
        <FlatList
          contentContainerStyle={{padding: 15, gap: 15}}
          data={arrayToUse}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <ListProduct {...{item}}>
              <TouchableOpacity onPress={() => like_Unlike_Product({item})}>
                <Icon2
                  name="trash-bin-outline"
                  size={22}
                  color={currentTextColor}
                />
              </TouchableOpacity>
            </ListProduct>
          )}
        />
      )}
    </View>
  );
};

export default Likes;

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'transparent',
    paddingLeft: 40,
    fontSize: 20,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10,
  },

  searchIcon: {
    position: 'absolute',
    marginTop: 10,
    left: 0,
    marginLeft: 10,
    zIndex: 10,
  },
});
