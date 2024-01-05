import {
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useContext, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';

import StarRating from 'react-native-star-rating';

import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  deleteCartItem,
  increaseItemQuantity,
  decreaseItemQuantity,
} from '../redux/actions';
import RenderRecommended from '../components/RenderRecommended';
import {Theme} from '../context/themeContext';
const themeColor = '#6236FF';

const ShowMoreText = ({text, maxLength}) => {
  const [showFullText, setShowFullText] = useState(false);
  const numberOfLines = showFullText ? null : 2;
  const {currentTextColor} = useContext(Theme);
  const [userData, setUserData] = useState(null);

  return (
    <View>
      <Text
        style={{
          color: currentTextColor,
          fontSize: 20,
          lineHeight: 30,
        }}
        numberOfLines={numberOfLines}>
        {text}
      </Text>
      {text.length > maxLength && (
        <Pressable
          onPress={() => setShowFullText(!showFullText)}
          style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Text
            style={{color: currentTextColor, fontWeight: 'bold', fontSize: 20}}>
            {showFullText ? 'show less' : 'show more'}
          </Text>
          <Icon
            name={showFullText ? 'chevron-up' : 'chevron-down'}
            color={currentTextColor}
            size={20}
          />
        </Pressable>
      )}
    </View>
  );
};

const Separator = () => {
  return (
    <View
      style={{
        backgroundColor: '#cccccc',
        height: 0.7,
        marginHorizontal: 15,
      }}></View>
  );
};

const DetailsText = ({text, value}) => {
  const {currentTextColor} = useContext(Theme);
  return (
    value && (
      <Text style={{color: currentTextColor, fontSize: 18, fontWeight: '400'}}>
        {text}:{' '}
        {<Text style={{fontWeight: 'bold', fontSize: 20}}>{value}</Text>}
      </Text>
    )
  );
};

const ProductDisplay = () => {
  const {theme, currentTextColor, currentBgColor} = useContext(Theme);
  const [productIndex, setProductIndex] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [isProductLiked, setProductLiked] = useState(route.params.userLiked);
  const [userId, setUserId] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [UserRating, setUserRating] = useState(0);
  const dispatch = useDispatch();
  const {cart} = useSelector(state => state.cartReducer);
  const addNewCartItem = newCartItem => dispatch(addToCart(newCartItem));
  const removeCartItem = cartItem => dispatch(deleteCartItem(cartItem));
  const increaseQuantity = product => dispatch(increaseItemQuantity(product));
  const decreaseQuantity = product => dispatch(decreaseItemQuantity(product));
  const [recommended, setRecommended] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  const cartItem = cart.find(obj => obj._id == route.params.productId);

  const styleInner = StyleSheet.create({
    container: {
      backgroundColor: currentBgColor,
      paddingVertical: 15,
    },
    productImage: {
      flex: 1,
      width: 'auto',
      height: '100%',
    },
    productPrice: {
      color: currentTextColor,
      fontWeight: '500',
      fontSize: 25,
    },
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
    productTitle: {
      color: currentTextColor,
      fontSize: 30,
      fontWeight: '500',
    },
    _title: {
      color: currentTextColor,
      fontSize: 20,
      fontWeight: '500',
    },
    addMinusBtn: {
      borderColor: currentTextColor,
      borderWidth: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      width: 'auto',
      borderRadius: 5,
      width: 30,
    },
  });

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  // useffect to check if user has liked product or not before displaying product
  useEffect(() => {
    const getUser = async () => {
      try {
        setDataLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        const productId = route.params.productId;
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.userId);
          const response = await axios.get(
            `http://localhost:8000/users/${decoded.userId}`,
          );
          if (response.status == 200) {
            setUserData(response.data);
            if (response.data.likedProducts.includes(productId)) {
              setProductLiked(true);
            } else {
              setProductLiked(false);
            }

            setDataLoading(false);
          } else {
            showToastWithGravity('Something went wrong');

            setDataLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setDataLoading(false);
      }
    };
    getUser();
  }, []);

  // useffect to get recommended products before product displays
  useEffect(() => {
    const getRecommended = async () => {
      setRecommendedLoading(true);
      try {
        await axios
          .get(`http://localhost:8000/recomended/${route.params.productId}`)
          .then(response => {
            if (response.status == 200) {
              setRecommended(
                response.data.filter(
                  item => item._id !== route.params.productId,
                ),
              );
              setRecommendedLoading(false);
            }
          })
          .catch(error => {
            console.log(error.response);
            setRecommended([]);
            setRecommendedLoading(false);
          });
      } catch (error) {
        console.log(error);
        setRecommendedLoading(false);
      }
    };
    getRecommended();
  }, []);

  // function to update data on every change

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const productId = route.params.productId;
          if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
            const response = await axios.get(
              `http://localhost:8000/users/${decoded.userId}`,
            );
            if (response.status == 200) {
              setUserData(response.data);
            }
          }
        } catch (error) {
          console.log('Something went wrong');
        }
      };
      getUser();
    }, [userData]),
  );

  // function to like / unlike product
  async function like_UnlikeProduct() {
    setProductLiked(!isProductLiked);
    try {
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
            productId: route.params.productId,
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
  }

  // this is a function to rate product

  async function rateProduct({rating}) {
    setUserRating(rating);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const productId = route.params.productId;
      if (token) {
        const decoded = jwtDecode(token);
        const response = await fetch('http://localhost:8000/rateProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: decoded.userId,
            productId: route.params.productId,
            newRating: rating,
          }),
        });
        if (response.status == 200 || 201) {
          showToastWithGravity(
            'Your rating for this product has been updated successfully.',
          );
        } else if (response.status == 404) {
          showToastWithGravity('Something went wrong');
        } else if (response.status == 500) {
          showToastWithGravity('Server error');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddToCart = item => {
    addNewCartItem(item);
  };

  const increaseQuantityState = item => {
    item.quantity == item.stock ? null : increaseQuantity(item);
  };

  const decreaseQuantityState = item => {
    item.quantity == 1 ? removeCartItem(item) : decreaseQuantity(item);
  };

  return (
    <SafeAreaView style={{backgroundColor: currentBgColor, flex: 1}}>
      <StatusBar
        backgroundColor={currentBgColor}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
      />

      <View style={styleInner.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" color={currentTextColor} size={25} />
          </Pressable>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}>
            <Pressable>
              <Icon2
                name="share-social-outline"
                color={currentTextColor}
                size={25}
              />
            </Pressable>
            <Pressable>
              <Icon
                name="ellipsis-vertical"
                color={currentTextColor}
                size={25}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {dataLoading && recommendedLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={currentTextColor} size={30} />
        </View>
      )}
      {!dataLoading && !recommendedLoading && (
        <>
          <ScrollView>
            <View style={{height: 350}}>
              <Image
                source={{
                  uri: route.params.image,
                }}
                resizeMode="contain"
                style={styleInner.productImage}
              />
            </View>
            <View style={{gap: 30, paddingVertical: 20}}>
              <View
                style={{
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{gap: 5}}>
                  <Text style={styleInner.productTitle}>
                    {route.params.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <Icon
                      name="star"
                      size={18}
                      color={'#ffe169'}
                      solid={true}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '400',
                        color: currentTextColor,
                      }}>
                      {route.params.averageRating.toFixed(1)}
                    </Text>
                  </View>
                  {!route.params.isDealActive && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        name="naira-sign"
                        size={20}
                        color={currentTextColor}
                      />
                      <Text style={styleInner.productPrice}>
                        {cartItem ? cartItem.price : route.params.price}
                      </Text>
                    </View>
                  )}
                  {route.params.isDealActive && (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'flex-end',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Icon
                            name="naira-sign"
                            size={12}
                            color={currentTextColor}
                          />
                          <Text style={styleInner.strikedPrice}>
                            {route.params.price}
                          </Text>
                        </View>

                        <View style={styleInner.lineThrough}></View>
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon
                          name="naira-sign"
                          size={20}
                          color={currentTextColor}
                        />
                        <Text style={styleInner.productPrice}>
                          {cartItem
                            ? cartItem.price
                            : route.params.discountPrice}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <Pressable onPress={like_UnlikeProduct}>
                  <Icon2
                    name={isProductLiked ? 'heart' : 'heart-outline'}
                    size={35}
                    color={isProductLiked ? '#FF4747' : currentTextColor}
                  />
                </Pressable>
              </View>

              <View style={{paddingHorizontal: 15, gap: 10}}>
                <ShowMoreText text={route.params.description} maxLength={80} />
              </View>

              <View style={{paddingHorizontal: 15, gap: 10}}>
                <Text style={styleInner._title}>Details</Text>
                <View style={{gap: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <DetailsText text={'Brand'} value={route.params.brand} />
                  <DetailsText
                    text={'Material'}
                    value={route.params.material}
                  />
                  <DetailsText
                    text={'Condition'}
                    value={route.params.condition}
                  />
                  <DetailsText text={'Colors'} value={route.params.colors} />
                  <DetailsText text={'Sizes'} value={route.params.sizes} />
                </View>
              </View>
              {/* this is to be used somewhere else */}
              {/* <View style={{paddingHorizontal: 15, gap: 15}}>
                {userData?.ratedProducts?.find(
                  obj => obj.productId === route.params.productId,
                ) ? null : (
                  <Text style={styleInner._title}>Rate this product</Text>
                )}

                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={UserRating}
                  selectedStar={rating => rateProduct({rating})}
                  fullStarColor={'#ffe169'}
                  starSize={35}
                  emptyStarColor={currentTextColor}
                  containerStyle={{justifyContent: 'flex-start', gap: 5}}
                />
              </View> */}
            </View>
            {/* recommended section */}
            <Separator />
            <View style={{paddingVertical: 15}}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '500',
                  color: currentTextColor,
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                }}>
                More like this
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    gap: 15,
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                  }}>
                  {recommended.map((item, index) => (
                    <RenderRecommended item={item} key={index} />
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
          <View
            style={[
              styles.addToCartContainer,
              {
                backgroundColor: currentBgColor,
              },
            ]}>
            {cart.find(obj => obj._id == route.params.productId) == null && (
              <TouchableOpacity
                onPress={() => handleAddToCart(route.params.item)}>
                <View
                  style={{
                    backgroundColor: themeColor,
                    width: '100%',
                    paddingVertical: 15,
                    borderRadius: 10,
                  }}>
                  <View style={styles.addToCartBtnFlexRow}>
                    <Icon name={'bag-shopping'} size={25} color="#fff" />
                    <Text style={{color: '#fff', fontSize: 20}}>
                      Add to cart
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {cart.find(obj => obj._id == route.params.productId) && (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', gap: 15}}>
                  <Pressable
                    style={[
                      styleInner.addMinusBtn,
                      {borderColor: currentTextColor},
                    ]}
                    onPress={() => decreaseQuantityState(cartItem)}>
                    <Icon name="minus" size={15} color={currentTextColor} />
                  </Pressable>
                  <Text
                    style={{
                      color: currentTextColor,
                      fontSize: 20,
                      fontWeight: '500',
                    }}>
                    {cartItem?.quantity}
                  </Text>
                  <Pressable
                    style={[
                      styleInner.addMinusBtn,
                      {borderColor: currentTextColor},
                    ]}
                    onPress={() => increaseQuantityState(cartItem)}>
                    <Icon name="plus" size={15} color={currentTextColor} />
                  </Pressable>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity onPress={() => removeCartItem(cartItem)}>
                    <View
                      style={{
                        backgroundColor: themeColor,
                        width: '100%',
                        paddingVertical: 15,
                        borderRadius: 10,
                      }}>
                      <View style={styles.addToCartBtnFlexRow}>
                        <Icon name={'check'} size={25} color="#fff" />
                        <Text style={{color: '#fff', fontSize: 20}}>
                          Added to cart
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ProductDisplay;

const styles = StyleSheet.create({
  colorBtns: {
    borderWidth: 2,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 45,
  },
  colorBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },

  sizeBtn: {
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
  },
  topBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
  },
  addToCartBtnFlexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  addToCartContainer: {
    height: 90,
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#111',
    paddingHorizontal: 20,
  },
  seperator: {
    height: 0.8,
    marginHorizontal: 15,
  },
});
