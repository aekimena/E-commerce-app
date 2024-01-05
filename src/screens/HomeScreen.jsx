import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Icon2 from 'react-native-vector-icons/Ionicons';

// import NoFilterScreen from './NoFilterScreen';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheet} from '../context/bottomSheetContext';
import {useSelector} from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Badge from '../components/Badge';
import {Theme} from '../context/themeContext';
import {GeneralContext} from '../context/generalContext';
// import SkeletonLoader from './SkeletonLoader';

const themeColor = '#6236FF';

const HomeScreen = () => {
  const {drawer} = useContext(GeneralContext);
  const {currentTextColor, currentBgColor, theme} = useContext(Theme);
  const {refRBSheetForCart} = useContext(BottomSheet);
  const [activeGroup, setActiveGroup] = useState(null);
  const [userData, setUserData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const navigation = useNavigation();
  const window = useWindowDimensions();

  const groups = [
    {id: 1, name: 'Best Sellers'},
    {id: 2, name: 'New Arrivals'},
    {id: 3, name: 'Top Rated'},
  ];

  const categoryData = [
    {
      id: 1,
      imageSource: 'https://i.ibb.co/ss4kj0d/sweater-For-Women-2.jpg',
      name: 'Clothing',
      endpoint: 'clothing',
    },
    {
      id: 2,
      imageSource: 'https://i.ibb.co/X8m0hqs/shoe-For-Men.jpg',
      name: 'Shoes',
      endpoint: 'shoes',
    },

    {
      id: 4,
      imageSource: 'https://i.ibb.co/7zDJfWY/wristwatch-For-Men-3.jpg',
      name: 'Watches',
      endpoint: 'watches',
    },
    {
      id: 5,
      imageSource: 'https://i.ibb.co/fkrdDpt/fedora-For-Women-4.jpg',
      name: 'Accessories',
      endpoint: 'accessories',
    },
    {
      id: 6,
      imageSource: 'https://i.ibb.co/MSZG7hT/handbag-For-Women.jpg',
      name: 'Bags',
      endpoint: 'bags',
    },
  ];

  const ListView = ({item}) => {
    return (
      <TouchableOpacity
        style={{width: (window.width - 48) / 2}}
        onPress={() =>
          navigation.navigate('categories', {
            name: item.name,
            endpoint: item.endpoint,
          })
        }>
        <Image
          source={{uri: item.imageSource}}
          style={{width: '100%', height: 200, borderRadius: 10}}
          resizeMode="cover"
        />
        <Text
          style={{color: currentTextColor, fontSize: 20, paddingVertical: 10}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  // useffect to get user data for name
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
                showToastWithGravity('Something went wrong');

                setDataLoading(false);
              } else if (error.response.status === 500) {
                showToastWithGravity('Server error');
                setDataLoading(false);
              }
            });
        }
      } catch (error) {
        console.log('Something went wrong!');
        setDataLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <View style={{backgroundColor: currentBgColor, flex: 1}}>
      <View>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', gap: 15}}>
            <TouchableOpacity
              onPress={() => drawer.current.openDrawer()}
              style={[
                styles.profileIndicator,
                {borderColor: currentTextColor},
              ]}>
              <Icon name="user" color={currentTextColor} size={15} />
            </TouchableOpacity>

            <Text
              style={{
                color: currentTextColor,
                fontSize: 25,
              }}>
              {dataLoading || userData.firstName == undefined
                ? 'Hi ...'
                : 'Hi,' + ' ' + userData.firstName}
            </Text>
          </View>

          <TouchableOpacity
            style={{flexDirection: 'row', gap: 20}}
            onPress={() => refRBSheetForCart.current.open()}>
            <Badge>
              <Icon2 name="cart-outline" size={30} color={currentTextColor} />
            </Badge>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 5}}>
          <View style={[{padding: 15}, styles.groups]}>
            {groups.map(item => (
              <Pressable
                onPress={null}
                key={item.id}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 7,
                  borderRadius: 10,
                  backgroundColor: theme == 'light' ? '#F2F1F3' : '#222',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 20,
                  }}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView>
        {/* <NoFilterScreen /> */}
        <View style={styles.dealsImg}>
          <Image
            source={{
              uri: 'https://i.ibb.co/26DrQp6/freestocks-3-Q3ts-J01nc-unsplash.jpg',
            }}
            style={{height: '100%', width: '100%', borderRadius: 10}}
            resizeMode="cover"
          />
          <View style={styles.dealsImgTextBtnContainer}>
            <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
              Get your special sales up to 50%
            </Text>

            <TouchableOpacity
              style={styles.dealsImgBtn}
              onPress={() => navigation.navigate('specials')}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#222',
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                Shop now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.layer}></View>
        </View>

        <View style={{paddingHorizontal: 15, paddingTop: 25}}>
          <Text
            style={{color: currentTextColor, fontSize: 22, fontWeight: '500'}}>
            Categories for you
          </Text>
          <View style={styles.categoryContainer}>
            {categoryData.map(item => (
              <ListView item={item} key={item.id} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  profileIndicator: {
    height: 35,
    width: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },

  groups: {
    flexDirection: 'row',
    gap: 15,
  },

  categoryContainer: {
    width: '100%',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 15,
  },

  dealsImg: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 15,
  },

  layer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },

  categoryContainer: {
    width: '100%',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 15,
  },
  dealsImgBtn: {
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 20,

    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  dealsImgTextBtnContainer: {
    position: 'absolute',
    height: '100%',
    padding: 15,
    alignSelf: 'flex-start',
    justifyContent: 'space-evenly',
    zIndex: 20,
  },
});
