import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Header from '../components/Header';
import {Theme} from '../context/themeContext';

const RenderOrders = ({item}) => {
  const {currentBgColor, currentTextColor, theme} = useContext(Theme);
  const navigation = useNavigation();
  const totalItems = item.products.reduce((x, y) => {
    return x + y.quantity;
  }, 0);

  const statusColor = () => {
    if (item.status == 'Pending') {
      return '#B89928';
    } else if (item.status == 'Delivered') {
      return '#43AA2C';
    } else if (item.status == 'Failed') {
      return 'red';
    }
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('myOrderDetail', {item})}
      style={{
        backgroundColor: theme == 'light' ? '#F8F8F8' : '#222',
        height: 'auto',
        borderColor: currentTextColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{gap: 5, flex: 1}}>
        <Text
          style={{color: currentTextColor, fontSize: 22, fontWeight: '500'}}>
          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="naira-sign" size={15} color={currentTextColor} />
          <Text
            style={{fontWeight: 'bold', fontSize: 22, color: currentTextColor}}>
            {item.totalPrice}
          </Text>
        </View>
        <Text
          style={{color: currentTextColor, fontSize: 14, fontWeight: '400'}}>
          {item.createdAt}
        </Text>
      </View>
      <View>
        <Text style={{fontSize: 18, fontWeight: '500', color: statusColor()}}>
          {item.status}
        </Text>
      </View>
    </Pressable>
  );
};

const MyOrderScreen = () => {
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterBtn, setFilterBtn] = useState('Pending');
  const {currentBgColor, currentTextColor, theme, themeColor} =
    useContext(Theme);

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };
  const getData = async () => {
    try {
      setDataLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        await axios
          .get(`http://localhost:8000/${decoded.userId}/orders`)
          .then(response => {
            if (response.status == 200) {
              setDataLoading(false);
              setData(response.data);
            }
          })
          .catch(error => {
            if (error.response.status == 404) {
              showToastWithGravity('Something went wrong');
              setDataLoading(false);
            } else if (error.response.status == 500) {
              showToastWithGravity('Server error');
              setDataLoading(false);
            }
          });
      }
    } catch (error) {
      console.log(error);
      setDataLoading(false);
    }
  };

  // useffect to get orders
  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const decoded = jwtDecode(token);
            await axios
              .get(`http://localhost:8000/${decoded.userId}/orders`)
              .then(response => {
                if (response.status == 200) {
                  setData(response.data);
                }
              });
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }, [data]),
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: currentBgColor}}>
      <View
        style={{
          borderBottomWidth: 0.5,
          borderColor: currentTextColor,
          paddingBottom: 15,
        }}>
        <Header name={'My Orders'} showCart={false} />
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

      {!dataLoading &&
        (data.length == 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>You haven't ordered anything</Text>
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              <Pressable
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      filterBtn === 'Pending'
                        ? themeColor
                        : theme == 'light'
                        ? '#f1f3f2'
                        : '#222',
                  },
                ]}
                onPress={() =>
                  filterBtn == 'Pending' ? null : setFilterBtn('Pending')
                }>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '400',
                    color: filterBtn === 'Pending' ? '#fff' : currentTextColor,
                  }}>
                  Pending
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      filterBtn === 'Delivered'
                        ? themeColor
                        : theme == 'light'
                        ? '#f1f3f2'
                        : '#222',
                  },
                ]}
                onPress={() =>
                  filterBtn == 'Delivered' ? null : setFilterBtn('Delivered')
                }>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '400',
                    color:
                      filterBtn === 'Delivered' ? '#fff' : currentTextColor,
                  }}>
                  Delivered
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      filterBtn === 'Failed'
                        ? themeColor
                        : theme == 'light'
                        ? '#f1f3f2'
                        : '#222',
                  },
                ]}
                onPress={() =>
                  filterBtn == 'Failed' ? null : setFilterBtn('Failed')
                }>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '400',
                    color: filterBtn === 'Failed' ? '#fff' : currentTextColor,
                  }}>
                  Failed
                </Text>
              </Pressable>
            </View>
            <FlatList
              contentContainerStyle={{padding: 15, paddingTop: 5, gap: 15}}
              data={data.filter(item => item.status === filterBtn)}
              keyExtractor={item => item._id}
              renderItem={({item}) => <RenderOrders {...{item}} />}
            />
          </>
        ))}
    </SafeAreaView>
  );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F2F1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
