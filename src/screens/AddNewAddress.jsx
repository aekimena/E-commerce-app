import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {BottomSheet} from '../context/bottomSheetContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

import LoadingModal from '../components/LoadingModal';
import {Theme} from '../context/themeContext';

const themeColor = '#6236FF';
const AddNewAddress = () => {
  const {currentBgColor, currentTextColor} = useContext(Theme);
  const {refRBSheetForAddress} = useContext(BottomSheet);
  const [mobileNo, setMobileNo] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandMark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isKeyboardShown, setKeyboardShown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // field validation states

  const [moNumIsEmpty, setMoNumError] = useState(false);
  const [cityIsEmpty, setCityError] = useState(false);
  const [streetIsEmpty, setStreetError] = useState(false);
  const [addressIsEmpty, setAddressError] = useState(false);
  const [postalCodeIsEmpty, setPostalCodeError] = useState(false);
  const [moNumIsValid, setMoNumIsValid] = useState(true);
  const [cityIsValid, setCityIsValid] = useState(true);
  const [streetIsValid, setStreetIsValid] = useState(true);
  const [addressIsValid, setAddressIsValid] = useState(true);
  const [landmarkIsValid, setLandmarkIsValid] = useState(true);
  const [postalCodeIsValid, setPostalCodeIsValid] = useState(true);

  const nameRegex = /^[a-zA-Z\s]+$/; // name regex
  const numbersLettersSpaces = /^[a-zA-Z0-9\s]*$/; // regex to check if input contains only letters and numbers

  useEffect(() => {
    const showTab = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShown(true);
    });
    const hideTab = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardShown(false);
    });

    return () => {
      showTab.remove();
      hideTab.remove();
    };
  }, []);

  const innerStyles = StyleSheet.create({
    textInput: {
      height: 50,
      borderRightColor: currentTextColor,
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 5,
      borderColor: currentTextColor,
      color: currentTextColor,
      fontSize: 17,
      padding: 15,
    },
    inputHeaderText: {
      color: currentTextColor,
      fontSize: 18,
      fontWeight: '500',
    },
  });

  // this function is to check if the textinputs are empty

  function validateFields() {
    if (mobileNo == '') {
      setMoNumError(true);
    } else {
      setMoNumError(false);
    }
    if (city == '') {
      setCityError(true);
    } else {
      setCityError(false);
    }
    if (street == '') {
      setStreetError(true);
    } else {
      setStreetError(false);
    }
    if (houseAddress == '') {
      setAddressError(true);
    } else {
      setAddressError(false);
    }
    if (postalCode == '') {
      setPostalCodeError(true);
    } else {
      setPostalCodeError(false);
    }
    return (
      mobileNo !== '' &&
      city !== '' &&
      street !== '' &&
      houseAddress !== '' &&
      postalCode !== ''
    );
  }

  // this function is to check if the inputs are regex valid

  function regexValid() {
    setCityIsValid(nameRegex.test(city));
    setStreetIsValid(numbersLettersSpaces.test(street));
    setAddressIsValid(numbersLettersSpaces.test(houseAddress));
    setLandmarkIsValid(nameRegex.test(landmark) || landmark == '');
    setMoNumIsValid(mobileNo.length == 11);
    setPostalCodeIsValid(postalCode !== '' && postalCode.length >= 5);

    return (
      nameRegex.test(city) &&
      numbersLettersSpaces.test(street) &&
      numbersLettersSpaces.test(houseAddress) &&
      numbersLettersSpaces.test(landmark) &&
      mobileNo.length == 11 &&
      postalCode !== '' &&
      postalCode.length >= 5
    );
  }

  // this is to set all states back to the way they were

  function setFieldToDefault() {
    setMoNumError(false);
    setCityError(false);
    setStreetError(false);
    setAddressError(false);
    setPostalCodeError(false);
    setMoNumIsValid(true);
    setCityIsValid(true);
    setStreetIsValid(true);
    setAddressIsValid(true);
    setLandmarkIsValid(true);
    setPostalCodeIsValid(true);
  }

  async function addNewAddress() {
    setFieldToDefault();
    try {
      if (validateFields()) {
        if (regexValid()) {
          setModalVisible(true);
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            await axios
              .post('http://localhost:8000/addNewAddress', {
                userId,
                mobileNo,
                city,
                street,
                houseAddress,
                landmark,
                postalCode,
              })
              .then(response => {
                if (response.status == 200) {
                  setModalVisible(false);
                  refRBSheetForAddress.current.close();
                  Alert.alert('Delivery address added successfully');
                }
              })
              .catch(error => {
                if (error.response.status == 400) {
                  setModalVisible(false);
                  Alert.alert('Delivery address already exists.');
                } else {
                  setModalVisible(false);
                  ToastAndroid.showWithGravity(
                    'Something went wrong',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                }
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
      setRegLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentBgColor,
        paddingHorizontal: 15,
      }}>
      <LoadingModal modalVisible={modalVisible} />
      <View
        style={[
          styles.header,
          {
            borderColor: currentTextColor,
            borderBottomWidth: 0.5,
          },
        ]}>
        <Pressable
          onPress={() => refRBSheetForAddress.current.close()}
          style={{position: 'absolute', left: 0}}>
          <Icon name="xmark" size={25} color={currentTextColor} />
        </Pressable>
        <View>
          <Text style={{fontSize: 25, color: currentTextColor}}>
            New Delivery Address
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              gap: 15,
              paddingVertical: 20,
              paddingBottom: isKeyboardShown ? 80 : 20,
            }}>
            <View>
              <Text style={innerStyles.inputHeaderText}>Mobile number</Text>
              <TextInput
                style={[
                  innerStyles.textInput,
                  {
                    borderColor: moNumIsEmpty ? 'red' : currentTextColor,
                    borderWidth: moNumIsEmpty ? 2 : 1,
                  },
                ]}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setMobileNo(newText)}
                defaultValue={mobileNo}
                keyboardType="phone-pad"
              />
              {!moNumIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  Mobile No. must be the Nigerian standard
                </Text>
              )}
            </View>
            <View>
              <Text style={innerStyles.inputHeaderText}>City</Text>
              <TextInput
                style={[
                  innerStyles.textInput,
                  {
                    borderColor: cityIsEmpty ? 'red' : currentTextColor,
                    borderWidth: cityIsEmpty ? 2 : 1,
                  },
                ]}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setCity(newText)}
                defaultValue={city}
              />
              {!cityIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  City field must only contain letters
                </Text>
              )}
            </View>
            <View>
              <Text style={innerStyles.inputHeaderText}>Street</Text>
              <TextInput
                style={[
                  innerStyles.textInput,
                  {
                    borderColor: streetIsEmpty ? 'red' : currentTextColor,
                    borderWidth: streetIsEmpty ? 2 : 1,
                  },
                ]}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setStreet(newText)}
                defaultValue={street}
              />
              {!streetIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  Street field must only contain lettere and numbers
                </Text>
              )}
            </View>
            <View>
              <Text style={innerStyles.inputHeaderText}>House Address</Text>
              <TextInput
                style={[
                  innerStyles.textInput,
                  {
                    borderColor: addressIsEmpty ? 'red' : currentTextColor,
                    borderWidth: addressIsEmpty ? 2 : 1,
                  },
                ]}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setHouseAddress(newText)}
                defaultValue={houseAddress}
              />
              {!addressIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  House adress field must only contain lettere and numbers
                </Text>
              )}
            </View>
            <View>
              <Text style={innerStyles.inputHeaderText}>
                Land Mark (Optional)
              </Text>
              <TextInput
                style={innerStyles.textInput}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setLandMark(newText)}
                defaultValue={landmark}
              />
              {!landmarkIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  Landmark field must only contain lettere and numbers
                </Text>
              )}
            </View>
            <View>
              <Text style={innerStyles.inputHeaderText}>Postal code</Text>
              <TextInput
                style={[
                  innerStyles.textInput,
                  {
                    borderColor: postalCodeIsEmpty ? 'red' : currentTextColor,
                    borderWidth: postalCodeIsEmpty ? 2 : 1,
                  },
                ]}
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setPostalCode(newText)}
                defaultValue={postalCode}
                keyboardType="number-pad"
              />
              {!postalCodeIsValid && (
                <Text style={{color: 'red', fontSize: 16}}>
                  Postal code cannot be empty
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={addNewAddress}
              style={{
                backgroundColor: themeColor,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: '500',
                }}>
                Add Address
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddNewAddress;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
  },
});
