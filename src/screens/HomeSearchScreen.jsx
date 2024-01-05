import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableHighlight,
  SafeAreaView,
  FlatList,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import {Theme} from '../context/themeContext';

const ListProduct = ({item}) => {
  const navigation = useNavigation();
  const {currentTextColor} = useContext(Theme);
  const styleInner = StyleSheet.create({
    strikedPrice: {
      color: currentTextColor,
      fontWeight: '400',
      fontSize: 22,
    },
    lineThrough: {
      backgroundColor: currentTextColor,
      height: 2,
      width: '100%',
      position: 'absolute',
    },
    productPrice: {
      color: currentTextColor,
      fontWeight: '500',
      fontSize: 20,
    },
  });

  function displayProduct(item) {
    navigation.navigate('productDisplay', {
      item: item,
      productId: item._id,
      title: item.title,
      price: item.price,
      discountPrice: item.discountPrice,
      isDealActive: item.isDealActive,
      image: item.image,
      material: item.details.material,
      condition: item.details.condition,
      brand: item.details.brand,
      colors: item.details.colors,
      sizes: item.details.sizes,
      description: item.description,
      averageRating: item['totalRatings'].averageRating,
    });
  }

  return (
    <TouchableOpacity
      style={{height: 120}}
      onPress={() => displayProduct(item)}>
      <View style={styles.productChildContainer}>
        <Image
          source={{
            uri: item.image,
          }}
          style={{height: '100%', width: 120, borderRadius: 10}}
          resizeMode="cover"
        />
        <View style={{gap: 10, flex: 1}}>
          <Text
            numberOfLines={1}
            style={{
              color: currentTextColor,
              fontWeight: 500,
              fontSize: 20,
            }}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}>
            <View style={{flex: 0}}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={item['totalRatings'].averageRating}
                // selectedStar={rating => ratingChange(productIndex.id, rating)}
                fullStarColor={'#ffe169'}
                starSize={20}
                emptyStarColor={currentTextColor}
                containerStyle={{justifyContent: 'flex-start', gap: 5}}
              />
            </View>

            <Text
              style={{color: currentTextColor, fontSize: 18, flex: 1}}
              numberOfLines={1}>
              {item['totalRatings'].totalUsers}
            </Text>
          </View>
          {!item.isDealActive && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="naira-sign" size={15} color={currentTextColor} />
              <Text style={styleInner.productPrice}>{item.price}</Text>
            </View>
          )}
          {item.isDealActive && (
            <View
              style={{flexDirection: 'row', gap: 10, alignItems: 'flex-end'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="naira-sign" size={12} color={currentTextColor} />
                  <Text style={styleInner.strikedPrice}>{item.price}</Text>
                </View>

                <View style={styleInner.lineThrough}></View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="naira-sign" size={15} color={currentTextColor} />
                <Text style={styleInner.productPrice}>
                  {item.discountPrice}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeSearchScreen = () => {
  const {currentBgColor, currentTextColor, theme} = useContext(Theme);
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const SearchPlaceholder = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          paddingHorizontal: 15,
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 120,
            width: 120,
            backgroundColor: theme == 'light' ? '#f8f8f8' : '#222',
            borderRadius: 10,
          }}></View>
        <View style={{justifyContent: 'space-evenly', height: 120}}>
          <View
            style={{
              backgroundColor: theme == 'light' ? '#f8f8f8' : '#222',
              height: 20,
              width: 220,
              borderRadius: 10,
            }}></View>
          <View
            style={{
              backgroundColor: theme == 'light' ? '#f8f8f8' : '#222',
              height: 20,
              width: 100,
              borderRadius: 10,
            }}></View>
          <View
            style={{
              backgroundColor: theme == 'light' ? '#f8f8f8' : '#222',
              height: 20,
              width: 110,
              borderRadius: 10,
            }}></View>
        </View>
      </View>
    );
  };

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  const getData = async () => {
    try {
      setDataLoading(true);
      await axios
        .get(`http://localhost:8000/search/${text}`)
        .then(response => {
          if (response.status == 200) {
            setData(response.data);
            setDataLoading(false);
          }
        })
        .catch(error => {
          if (error.response.status == 404) {
            null;
            console.log('nothing');
            setData([]);
            setDataLoading(false);
          } else if (error.response.status == 500) {
            showToastWithGravity('Something went wrong');
            setData([]);
            setDataLoading(false);
          }
        });
    } catch (error) {
      console.log('error', error);
      setData([]);
      setDataLoading(false);
    }
  };

  // useffect to get search items on every input
  useEffect(() => {
    getData();
  }, [text]);

  return (
    <SafeAreaView style={{backgroundColor: currentBgColor, flex: 1}}>
      <View style={styles.arrowSearchBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <Icon name="arrow-left" size={25} color={currentTextColor} />
        </TouchableOpacity>
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
            style={{position: 'absolute', zIndex: 10, left: 10}}
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
              autoFocus={true}
              placeholder="Search..."
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              placeholderTextColor={currentTextColor}
            />
          </View>
          {text.length > 0 && (
            <Pressable
              onPress={() => setText('')}
              style={{position: 'absolute', zIndex: 10, right: 10}}>
              <Icon2 name="close" size={25} color={currentTextColor} />
            </Pressable>
          )}
        </View>
      </View>

      {dataLoading && (
        <View style={{gap: 15}}>
          <SearchPlaceholder />
          <SearchPlaceholder />
        </View>
      )}

      {data.length > 0 && !dataLoading && (
        <FlatList
          contentContainerStyle={{padding: 15, gap: 15}}
          data={data}
          keyExtractor={item => item._id}
          renderItem={({item}) => <ListProduct {...{item}} />}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeSearchScreen;

const styles = StyleSheet.create({
  arrowSearchBar: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    gap: 20,
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'transparent',
    color: '#fff',
    paddingLeft: 40,
    fontSize: 20,
    height: 50,
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
  },

  searchIconSearchBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    marginTop: 10,
    left: 0,
    marginLeft: 10,
    zIndex: 10,
  },
  productChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    height: '100%',
    flex: 1,
  },
});
