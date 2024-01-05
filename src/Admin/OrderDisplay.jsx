// this is the order display for admin. this should be in another app

import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import LoadingModal from './LoadingModal';

const themeColor = '#6236FF';
const OrderDisplay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const {item, userId} = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  const totalItems = item.products.reduce((x, y) => {
    return x + y?.quantity;
  }, 0);

  const totalPrice = item.products.reduce((x, y) => {
    return x + y?.price;
  }, 0);

  const scrollToPage = pageNumber => {
    if (scrollRef.current) {
      const offsetX = pageNumber * Dimensions.get('window').width;
      scrollRef.current.scrollTo({x: offsetX, animated: true});
    }
  };

  const handleScroll = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffset / Dimensions.get('window').width,
    );
    setActiveIndex(currentIndex);
  };

  const confirmOrder = async () => {
    try {
      setModalVisible(true);
      await axios
        .post('http://localhost:8000/orderConfirmation', {
          orderId: item._id,
          adminId: userId,
          userId: item.user._id,
          confirmed: true,
        })
        .then(async response => {
          if (response.status == 200) {
            setModalVisible(false);
            Alert.alert('Order confirmed');
            navigation.navigate('orderScreenForAdmin');
            await axios
              .get(
                `http://localhost:8000/sendMessage/${item.user.deviceToken}/${item.user._id}/order-delivered`,
              )
              .then(response2 => {
                if (response2.status == 200) {
                  console.log('message sent');
                }
              })
              .catch(error => {
                console.log('couldnt send', error);
              });
          }
        })
        .catch(error => {
          if (error.response.status == 500) {
            setModalVisible(false);
            Alert.alert('Error from server.');
          }
        });
    } catch (error) {
      setModalVisible(false);
      Alert.alert('Something went wrong. Probably the network');
    }
  };

  function showConfirmAlert() {
    Alert.alert(
      'Confirm order',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: confirmOrder,
        },
      ],
      {cancelable: false},
    );
  }

  const terminateOrder = async () => {
    try {
      setModalVisible(true);
      await axios
        .post('http://localhost:8000/orderConfirmation', {
          orderId: item._id,
          adminId: userId,
          userId: item.user._id,
          confirmed: false,
        })
        .then(async response => {
          if (response.status == 200) {
            setModalVisible(false);
            Alert.alert('Order terminated');
            navigation.navigate('orderScreenForAdmin');
            await axios
              .get(
                `http://localhost:8000/sendMessage/${item.user.deviceToken}/${item.user._id}/order-cancelled`,
              )
              .then(response2 => {
                if (response2.status == 200) {
                  console.log('message sent');
                }
              })
              .catch(error => {
                console.log('couldnt send', error.response.data);
              });
          }
        })
        .catch(error => {
          if (error.response.status == 500) {
            setModalVisible(false);
            Alert.alert('Error from server.');
          }
        });
    } catch (error) {
      setModalVisible(false);
      Alert.alert('Something went wrong. Probably the network');
    }
  };

  function showTerminateAlert() {
    Alert.alert(
      'Terminate order',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: terminateOrder,
        },
      ],
      {cancelable: false},
    );
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <LoadingModal modalVisible={modalVisible} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          gap: 10,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#222" />
        </Pressable>

        <Text style={{color: '#222', fontSize: 24, fontWeight: '500'}}>
          Order details
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          style={[
            styles.scrollPageSelector,
            {borderBottomWidth: activeIndex == 0 ? 2 : 0},
          ]}
          onPress={() => scrollToPage(0)}>
          <Text style={{fontSize: 20, fontWeight: '500', color: '#222'}}>
            Details
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.scrollPageSelector,
            {borderBottomWidth: activeIndex == 1 ? 2 : 0},
          ]}
          onPress={() => scrollToPage(1)}>
          <Text style={{fontSize: 20, fontWeight: '500', color: '#222'}}>
            Products
          </Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{backgroundColor: '#f8f8f8'}}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        {/* page 1 */}
        <View style={{width: window.width, padding: 15}}>
          <ScrollView
            contentContainerStyle={{gap: 15}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.detailsBox}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="naira-sign" size={20} color={'#222'} />
                <Text style={{fontWeight: 'bold', fontSize: 30, color: '#222'}}>
                  {totalPrice + item.shippingPrice}
                </Text>
              </View>
              <View style={{gap: 15}}>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Total Items</Text>
                  <Text
                    style={{fontSize: 20, fontWeight: '400', color: '#222'}}>
                    {totalItems}
                  </Text>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Subtotal</Text>
                  <View style={styles.text_between_price}>
                    <Icon name="naira-sign" size={12} color={'#222'} />
                    <Text style={styles.text_between_price_number}>
                      {totalPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Shipping price</Text>
                  <View style={styles.text_between_price}>
                    <Icon name="naira-sign" size={12} color={'#222'} />
                    <Text style={styles.text_between_price_number}>
                      {item.shippingPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Total price</Text>
                  <View style={styles.text_between_price}>
                    <Icon name="naira-sign" size={12} color={'#222'} />
                    <Text style={styles.text_between_price_number}>
                      {totalPrice + item.shippingPrice}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.detailsBox, {gap: 15}]}>
              <View style={styles.text_between}>
                <Text style={styles.text_between_header}>User</Text>
                <Text style={styles.text_between_price_number}>
                  {item.user.firstName +
                    ' ' +
                    (item.user.lastName ? item.user.lastName : '')}
                </Text>
              </View>
              <View style={styles.text_between}>
                <Text style={styles.text_between_header}>Phone No.</Text>
                <Text style={styles.text_between_price_number}>
                  {item.shippingAddress.mobileNo}
                </Text>
              </View>
              <View style={[styles.text_between, {gap: 20}]}>
                <Text style={styles.text_between_header}>House Address</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.text_between_price_number}>
                    {item.shippingAddress.houseAddress}
                  </Text>
                </View>
              </View>
              <View style={[styles.text_between, {gap: 20}]}>
                <Text style={styles.text_between_header}>Street</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.text_between_price_number}>
                    {item.shippingAddress.street}
                  </Text>
                </View>
              </View>
              <View style={[styles.text_between, {gap: 20}]}>
                <Text style={styles.text_between_header}>City</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.text_between_price_number}>
                    {item.shippingAddress.city}
                  </Text>
                </View>
              </View>
              {item.shippingAddress.landmark && (
                <View style={[styles.text_between, {gap: 20}]}>
                  <Text style={styles.text_between_header}>Landmark</Text>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.text_between_price_number}>
                      {item.shippingAddress.landmark}
                    </Text>
                  </View>
                </View>
              )}
              <View style={[styles.text_between, {gap: 20}]}>
                <Text style={styles.text_between_header}>Postal Code</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.text_between_price_number}>
                    {item.shippingAddress.postalCode}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailsBox}>
              <View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Payment method</Text>
                  <Text style={styles.text_between_price_number}>
                    {item.paymentMethod}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailsBox}>
              <View style={styles.text_between}>
                <Text style={styles.text_between_header}>Order ID</Text>
                <View style={{flex: 0}}>
                  <Text style={styles.text_between_price_number}>
                    {item._id}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        {/* page 2 */}
        <View style={{width: window.width}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 15, gap: 15}}>
              {item.products.map((product, index) => (
                <View key={index} style={styles.detailsBox}>
                  <View style={{gap: 15}}>
                    <Image
                      source={{uri: product.image}}
                      style={{
                        height: 120,
                        width: 120,
                        borderRadius: 10,
                        alignSelf: 'center',
                      }}
                      resizeMode="cover"
                    />
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Name</Text>
                      <Text style={styles.text_between_price_number}>
                        {product.name}
                      </Text>
                    </View>
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Price</Text>
                      <View style={styles.text_between_price}>
                        <Icon name="naira-sign" size={12} color={'#222'} />
                        <Text style={styles.text_between_price_number}>
                          {product.price}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Gender</Text>
                      <Text style={styles.text_between_price_number}>
                        {product.gender.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Color</Text>
                      <Text style={styles.text_between_price_number}>
                        {product.color}
                      </Text>
                    </View>
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Size</Text>
                      <Text style={styles.text_between_price_number}>
                        {product.size}
                      </Text>
                    </View>
                    <View style={styles.text_between}>
                      <Text style={styles.text_between_header}>Quantity</Text>
                      <Text style={styles.text_between_price_number}>
                        {product.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={{padding: 15, borderColor: '#222', borderTopWidth: 0.5}}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity
            style={styles.confirm_terminate_btn}
            onPress={showConfirmAlert}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
              Confirm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTerminateAlert}
            style={[styles.confirm_terminate_btn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
              Terminate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDisplay;

const styles = StyleSheet.create({
  scrollPageSelector: {
    flex: 1,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: themeColor,
  },

  confirm_terminate_btn: {
    flex: 1,
    backgroundColor: themeColor,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text_between_header: {fontSize: 20, fontWeight: '400', color: '#222'},
  text_between_price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_between_price_number: {fontWeight: '500', fontSize: 20, color: '#222'},
  detailsBox: {
    backgroundColor: '#Fff',

    borderColor: '#222',
    height: 'auto',
    width: '100%',
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
  },
});
