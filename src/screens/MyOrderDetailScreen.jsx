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
import React, {useContext, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Header from '../components/Header';
import {Theme} from '../context/themeContext';
// import {Header} from '../components/resuableComponents';

const MyOrderDetailScreen = () => {
  const {currentBgColor, currentTextColor, theme, themeColor} =
    useContext(Theme);
  const route = useRoute();
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const {item} = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const totalItems = item.products.reduce((x, y) => {
    return x + y?.quantity;
  }, 0);

  const totalPrice = item.products.reduce((x, y) => {
    return x + y?.price;
  }, 0);

  const styles = StyleSheet.create({
    scrollPageSelector: {
      flex: 1,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
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
      alignItems: 'flex-start',
    },
    text_between_header: {
      fontSize: 20,
      fontWeight: '400',
      color: currentTextColor,
    },
    text_between_price: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text_between_price_number: {
      fontWeight: '500',
      fontSize: 20,
      color: currentTextColor,
    },
    detailsBox: {
      backgroundColor: theme == 'light' ? '#fff' : '#222',
      borderColor: currentTextColor,
      height: 'auto',
      width: '100%',
      borderRadius: 10,
      padding: 10,
      paddingVertical: 20,
    },
  });

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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: currentBgColor}}>
      <Header name={'Order'} showCart={false} />
      <View style={{flexDirection: 'row'}}>
        <Pressable
          style={[styles.scrollPageSelector]}
          onPress={() => scrollToPage(0)}>
          <Text
            style={{fontSize: 20, fontWeight: '500', color: currentTextColor}}>
            Details
          </Text>
          <View
            style={{
              backgroundColor: activeIndex == 0 ? themeColor : 'transparent',
              height: 5,
              width: 10,
              borderRadius: 5,
              marginTop: 3,
            }}></View>
        </Pressable>
        <Pressable
          style={[styles.scrollPageSelector]}
          onPress={() => scrollToPage(1)}>
          <Text
            style={{fontSize: 20, fontWeight: '500', color: currentTextColor}}>
            Products
          </Text>
          <View
            style={{
              backgroundColor: activeIndex == 1 ? themeColor : 'transparent',
              height: 5,
              width: 10,
              borderRadius: 5,
              marginTop: 3,
            }}></View>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme == 'light' ? '#f8f8f8' : null,
        }}
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
                <Icon name="naira-sign" size={20} color={currentTextColor} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 30,
                    color: currentTextColor,
                  }}>
                  {totalPrice + item.shippingPrice}
                </Text>
              </View>
              <View style={{gap: 15}}>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Total Items</Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '400',
                      color: currentTextColor,
                    }}>
                    {totalItems}
                  </Text>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Subtotal</Text>
                  <View style={styles.text_between_price}>
                    <Icon
                      name="naira-sign"
                      size={12}
                      color={currentTextColor}
                    />
                    <Text style={styles.text_between_price_number}>
                      {totalPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Shipping price</Text>
                  <View style={styles.text_between_price}>
                    <Icon
                      name="naira-sign"
                      size={12}
                      color={currentTextColor}
                    />
                    <Text style={styles.text_between_price_number}>
                      {item.shippingPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.text_between}>
                  <Text style={styles.text_between_header}>Total price</Text>
                  <View style={styles.text_between_price}>
                    <Icon
                      name="naira-sign"
                      size={12}
                      color={currentTextColor}
                    />
                    <Text style={styles.text_between_price_number}>
                      {totalPrice + item.shippingPrice}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.detailsBox, {gap: 15}]}>
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
                        <Icon
                          name="naira-sign"
                          size={12}
                          color={currentTextColor}
                        />
                        <Text style={styles.text_between_price_number}>
                          {product.price}
                        </Text>
                      </View>
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
    </SafeAreaView>
  );
};

export default MyOrderDetailScreen;
