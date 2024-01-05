import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Alert,
  Pressable,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import AddNewAddress from './AddNewAddress';
import BottomSheetContext, {BottomSheet} from '../context/bottomSheetContext';
import EditAddress from './EditAddress';
import {useDispatch} from 'react-redux';
import {resetStates} from '../redux/actions';
import {Theme} from '../context/themeContext';
import Header from '../components/Header';
import LoadingModal from '../components/LoadingModal';

const Seperator = () => {
  const {currentTextColor} = useContext(Theme);
  return (
    <View style={{alignItems: 'center', marginTop: 15}}>
      <View
        style={{
          backgroundColor: currentTextColor,
          height: 0.5,
          width: '95%',
        }}></View>
    </View>
  );
};

// bottom sheet for new address
const BSDisplayForNewAddress = () => {
  const {currentTextColor, currentBgColor} = useContext(Theme);
  const {refRBSheetForAddress} = useContext(BottomSheet);
  return (
    <RBSheet
      ref={refRBSheetForAddress}
      closeOnDragDown={true}
      closeOnPressMask={true}
      animationType="slide"
      dragFromTopOnly={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
        draggableIcon: {
          backgroundColor: currentTextColor,
        },
        container: {
          backgroundColor: currentBgColor,
          height: Dimensions.get('window').height - 10,
        },
      }}>
      <AddNewAddress />
    </RBSheet>
  );
};

// bottom sheet for edit address
const BSDisplayForEditAddress = ({children}) => {
  const {currentTextColor, currentBgColor} = useContext(Theme);
  const {refRBSheetForEditAddress} = useContext(BottomSheet);
  return (
    <RBSheet
      ref={refRBSheetForEditAddress}
      closeOnDragDown={true}
      closeOnPressMask={true}
      animationType="slide"
      dragFromTopOnly={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
        draggableIcon: {
          backgroundColor: currentTextColor,
        },
        container: {
          backgroundColor: currentBgColor,
          height: Dimensions.get('window').height - 10,
        },
      }}>
      {children}
    </RBSheet>
  );
};

const UserPage = () => {
  const {currentBgColor, currentTextColor, theme, loadTheme} =
    useContext(Theme);
  const {refRBSheetForAddress, refRBSheetForEditAddress} =
    useContext(BottomSheet);
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mobileNo, setmobileNo] = useState('');
  const [street, setStreet] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [objId, setObjId] = useState('');
  const [city, setCity] = useState('');

  const styleInner = StyleSheet.create({
    accountBtn: {
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      flexDirection: 'row',
      gap: 5,
      borderColor: currentTextColor,
      borderWidth: 0.5,
    },
  });

  async function logOut() {
    try {
      setModalVisible(true);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('theme');
      loadTheme();
      dispatch(resetStates());
      navigation.replace('login');
    } catch (error) {
      console.log('error', error);
    }
  }

  function showAlert() {
    Alert.alert(
      'Log Out',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: logOut,
        },
      ],
      {cancelable: false},
    );
  }

  function showNotFoundAlert() {
    Alert.alert(
      'Something went wrong!',
      'Please log back into your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: logOut,
        },
      ],
      {cancelable: false},
    );
  }

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  // function to get user data
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
                // console.log('something went wrong');
                showNotFoundAlert();
                setDataLoading(false);
              } else if (error.response.status === 500) {
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
    getData();
  }, []);

  // callback to get user data on every change without interrupting
  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            await axios
              .get(`http://localhost:8000/users/${userId}`)
              .then(response => {
                if (response.status === 200) {
                  setUserData(response.data);
                }
              });
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }, [userData]),
  );

  function editThisAddress(item) {
    setmobileNo(item?.mobileNo);
    setStreet(item?.street);
    setCity(item?.city);
    setHouseAddress(item?.houseAddress);
    setPostalCode(item?.postalCode);
    setLandmark(item?.landmark);
    setObjId(item?._id);
    refRBSheetForEditAddress.current.open();
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: currentBgColor}}>
      <StatusBar
        backgroundColor={currentBgColor}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
      />
      <LoadingModal modalVisible={modalVisible} />
      <>
        <View
          style={{
            borderColor: currentTextColor,
            borderBottomWidth: 0.5,
            paddingBottom: 15,
          }}>
          <Header showCart={false} name={'Profile'} />
        </View>
        {dataLoading && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color={currentTextColor} size={30} />
          </View>
        )}
        {!userData && !dataLoading && (
          <Text
            style={{
              color: currentTextColor,
              fontSize: 20,
              flex: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Something went wrong
          </Text>
        )}
        {!dataLoading && userData && (
          <ScrollView contentContainerStyle={{paddingVertical: 25}}>
            <View style={{gap: 10, paddingHorizontal: 15}}>
              <View
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 60,
                  borderColor: currentTextColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                }}>
                <Icon2
                  name="person-add-outline"
                  color={currentTextColor}
                  size={60}
                />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 22,
                    fontWeight: 'bold',
                  }}>
                  {userData.firstName} {userData.lastName}
                </Text>
                <Icon name="pen-to-square" color={currentTextColor} size={20} />
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 22,
                    fontWeight: '400',
                  }}>
                  {userData.email}
                </Text>
                <Icon name="pen-to-square" color={currentTextColor} size={20} />
              </View>
            </View>
            <Seperator />
            <View style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 22,
                    fontWeight: '500',
                  }}>
                  Address
                </Text>
                <Icon name="location-dot" color={currentTextColor} size={18} />
              </View>

              <View
                style={{
                  alignItems:
                    userData?.addresses?.length < 1 ? 'center' : 'flex-start',
                }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{marginTop: 15}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                      paddingHorizontal: 15,
                    }}>
                    <Pressable
                      onPress={() => refRBSheetForAddress.current.open()}
                      style={{
                        paddingVertical: 20,
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          height: 80,
                          width: 80,
                          borderRadius: 40,
                          borderColor: currentTextColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                        }}>
                        <Icon2 name="add" color={currentTextColor} size={50} />
                      </View>
                      {userData?.addresses?.length < 1 && (
                        <Text
                          style={{
                            color: currentTextColor,
                            fontSize: 20,
                            fontWeight: '400',
                          }}>
                          Add an Address
                        </Text>
                      )}
                    </Pressable>
                    {userData?.addresses?.length > 0 &&
                      userData.addresses.map(item => (
                        <Pressable
                          key={item._id}
                          onPress={() => editThisAddress(item)}
                          style={{
                            gap: 5,
                            borderRadius: 10,
                            minHeight: 100,
                            width: window.width / 2,
                            borderWidth: 1,
                            borderColor: currentTextColor,
                            padding: 15,
                          }}>
                          <Icon
                            name="location-dot"
                            color={currentTextColor}
                            size={20}
                          />
                          <Text
                            style={{
                              color: currentTextColor,
                              fontSize: 18,
                              fontWeight: '500',
                            }}
                            numberOfLines={1}>
                            {item.houseAddress}
                          </Text>
                          <Text
                            style={{
                              color: currentTextColor,
                              fontSize: 18,
                              fontWeight: '500',
                            }}
                            numberOfLines={1}>
                            {item.street}
                          </Text>
                          <Text
                            style={{
                              color: currentTextColor,
                              fontSize: 18,
                              fontWeight: '500',
                            }}
                            numberOfLines={1}>
                            {item.city}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                </ScrollView>
              </View>
            </View>
            <Seperator />
            <View style={{marginTop: 15, paddingHorizontal: 15, gap: 15}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 22,
                    fontWeight: '500',
                  }}>
                  Account
                </Text>
                <Icon name="lock" color={currentTextColor} size={18} />
              </View>

              <TouchableOpacity style={styleInner.accountBtn}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Reset password
                </Text>
                <Icon2
                  name="refresh-outline"
                  color={currentTextColor}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showAlert}
                style={styleInner.accountBtn}>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Log Out
                </Text>
                <Icon2
                  name="log-out-outline"
                  color={currentTextColor}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ff0000',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  flexDirection: 'row',
                  gap: 5,
                }}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
                  Delete Account
                </Text>
                <Icon name="trash" color="#fff" size={18} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        <BSDisplayForNewAddress />

        <BSDisplayForEditAddress>
          <EditAddress
            mobileNoprop={mobileNo}
            streetprop={street}
            cityprop={city}
            objId={objId}
            landmarkprop={landmark}
            postalCodeprop={postalCode}
            houseAddressprop={houseAddress}
          />
        </BSDisplayForEditAddress>
      </>
    </SafeAreaView>
  );
};

export default UserPage;

const styles = StyleSheet.create({});
