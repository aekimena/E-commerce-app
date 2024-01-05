import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

import ProductList from '../components/renderListProducts';

import axios from 'axios';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, deleteCartItem} from '../redux/actions';

import Icon from 'react-native-vector-icons/FontAwesome6';
import Badge from '../components/Badge';
import {BottomSheet} from '../context/bottomSheetContext';
import {Theme} from '../context/themeContext';

const Categories = () => {
  const {currentBgColor, currentTextColor} = useContext(Theme);
  const {refRBSheetForCart} = useContext(BottomSheet);
  //////
  const {cart} = useSelector(state => state.cartReducer);
  const dispatch = useDispatch();
  const addNewCartItem = newCartItem => dispatch(addToCart(newCartItem));
  const removeCartItem = cartItem => dispatch(deleteCartItem(cartItem));
  ///////
  const [arrayToUse, setArrayToUse] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const [page, setPage] = useState(1);
  const [dataLoadingForRefresh, setDataLoadingForRefresh] = useState(false);
  const [dataLoadingForEndReached, setDataLoadingForEndReached] =
    useState(false);

  const route = useRoute();

  const handleAddToCart = item => {
    cart.find(obj => obj?._id == item._id)
      ? removeCartItem(item)
      : addNewCartItem(item);
  };

  // useffect to load product
  useEffect(() => {
    const getData = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get(
          `http://localhost:8000/products/${route.params.endpoint}/?page=${page}`,
        );

        if (response.status == 200) {
          setDataLoading(false);
          setArrayToUse(response.data);
        } else if (response.status == 404) {
          setDataLoading(false);
          setArrayToUse([]);
        } else if (response.status == 500) {
          setDataLoading(false);
          setArrayToUse([]);
          ToastAndroid.showWithGravity(
            'Something went wrong',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
      } catch (error) {
        console.log(error);
        setDataLoading(false);
        setArrayToUse([]);
      }
    };
    getData();
  }, []);

  // function to load product without interrupting
  const getDatawithoutInterupting = async () => {
    setDataLoadingForRefresh(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/products/${route.params.endpoint}/?page=${page}`,
      );

      if (response.status == 200) {
        setArrayToUse(response.data);
        setDataLoadingForRefresh(false);
      } else {
        setDataLoadingForRefresh(false);
      }
    } catch (error) {
      console.log(error);
      setDataLoadingForRefresh(false);
    }
  };

  // function to load product without showing refresh loader
  const getDatawithoutShowingLoader = async () => {
    setDataLoadingForEndReached(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/products/${route.params.endpoint}/?page=${page}`,
      );

      if (response.status == 200) {
        setArrayToUse(response.data);
        setDataLoadingForEndReached(false);
      } else {
        setDataLoadingForEndReached(false);
      }
    } catch (error) {
      console.log(error);
      setDataLoadingForEndReached(false);
    }
  };

  // function to load more products

  function incrementPage() {
    setPage(count => count + 1);
    getDatawithoutShowingLoader();
  }

  // component to show if the flatlist reaches the end
  const renderFooterLoader = () => {
    return dataLoadingForEndReached ? (
      <ActivityIndicator size={30} color={'#ccc'} />
    ) : null;
  };

  return (
    <SafeAreaView style={{backgroundColor: currentBgColor, flex: 1}}>
      <View
        style={{
          paddingBottom: 15,
          borderBottomWidth: 0.5,
          borderColor: currentTextColor,
        }}>
        <View style={[styles.header]}>
          <View style={styles.name_BackBtn}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={'arrow-left'} color={currentTextColor} size={25} />
            </TouchableOpacity>

            <Text
              style={{
                color: currentTextColor,
                fontSize: 22,
              }}>
              {route.params.name}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
            <TouchableOpacity onPress={() => refRBSheetForCart.current.open()}>
              <Badge>
                <Icon2 name="cart-outline" size={30} color={currentTextColor} />
              </Badge>
            </TouchableOpacity>

            <TouchableOpacity onPress={null}>
              <Icon2 name="filter-outline" size={27} color={currentTextColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {arrayToUse?.length == 0 && !dataLoading && (
        <Text
          style={{
            textAlign: 'center',
            color: currentTextColor,
            fontSize: 17,
            flex: 1,
            textAlignVertical: 'center',
          }}>
          No Products To Show
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

      {!dataLoading && arrayToUse.length > 0 && (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingVertical: 15,
          }}
          data={arrayToUse}
          numColumns={2}
          keyExtractor={item => item._id.toString()}
          renderItem={({item, index}) => (
            <ProductList {...{item, index}}>
              <TouchableOpacity onPress={() => handleAddToCart(item)}>
                <Icon2
                  name={
                    cart.find(obj => obj?._id == item._id)
                      ? 'checkmark-outline'
                      : 'add'
                  }
                  size={30}
                  color={currentTextColor}
                />
              </TouchableOpacity>
            </ProductList>
          )}
          onRefresh={getDatawithoutInterupting}
          refreshing={dataLoadingForRefresh}
          onEndReached={incrementPage}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooterLoader}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  name_BackBtn: {
    flexDirection: 'row',
    gap: 15,
    flex: 1,
    alignItems: 'center',
  },
});
