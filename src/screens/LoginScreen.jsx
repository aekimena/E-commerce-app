import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {Theme} from '../context/themeContext';
import {GeneralContext} from '../context/generalContext';
import messaging from '@react-native-firebase/messaging';

const InfoBox = ({message, iconName, bgColor}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 20,
        width: '100%',
        height: 100,

        backgroundColor: bgColor,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        padding: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Icon name={iconName} size={25} color={'#fff'} />
        <Text style={{color: '#fff', fontSize: 22, textAlign: 'center'}}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const LoginScreen = () => {
  const {setRegisteredEmail} = useContext(GeneralContext);
  const {currentTextColor, currentBgColor, themeColor} = useContext(Theme);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState(null);
  const [alertColor, setAlertColor] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [emailIsFocus, setEmailIsFocus] = useState(false);
  const [passwordIsFocus, setPasswordIsFocus] = useState(false);

  // input fields validation hooks

  const [emailIsEmpty, setEmailError] = useState(false);
  const [passwordIsEmpty, setPasswordError] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  // regex expressions

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
  const passwordRegex = /[^a-zA-Z0-9]/;

  function showInfo() {
    setIsInfoVisible(true);
    setTimeout(() => {
      setIsInfoVisible(false);
    }, 1500);
  }

  function emailPasswordError() {
    setMessage('Invalid email or password!');
    setAlertIcon('xmark');
    setAlertColor('#660202');
    showInfo();
  }

  function unknownError() {
    setMessage('Something went wrong.');
    setAlertIcon('circle-exclamation');
    setAlertColor('#362600');
    showInfo();
  }

  function loginSuccess() {
    setMessage('Login successful.');
    setAlertIcon('check');
    setAlertColor('#003609');
    showInfo();
  }

  // check for empty fields function

  function validateFields() {
    if (email == '') {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (password == '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    return email !== '' && password !== '';
  }

  // check for regex test

  function regexValid() {
    setIsValidEmail(emailRegex.test(email));
    setIsValidPassword(!passwordRegex.test(password) && password.length >= 6);
    return (
      emailRegex.test(email) &&
      !passwordRegex.test(password) &&
      password.length >= 6
    );
  }

  function setFieldToDefault() {
    setEmailError(false);
    setPasswordError(false);

    setIsValidEmail(true);

    setIsValidPassword(true);
  }

  const showToastWithGravity = text => {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };
  const handleLoginUser = async () => {
    const user = {
      email: email,
      password: password,
    };

    try {
      setFieldToDefault();
      if (validateFields()) {
        if (regexValid()) {
          setRegLoading(true);
          await axios
            .post('http://localhost:8000/login', user)
            .then(async response => {
              if (response.status == 200) {
                const data = await response.data;
                await AsyncStorage.setItem('authToken', data.token);
                const deviceToken = await messaging().getToken();
                const authToken = await AsyncStorage.getItem('authToken');
                const decoded = jwtDecode(authToken);

                // store device token in database
                await axios
                  .post('http://localhost:8000/refreshToken', {
                    userId: decoded.userId,
                    newToken: deviceToken,
                  })
                  .then(response => {
                    if (response.status == 200) {
                      console.log('token changed');
                    } else {
                      console.log('token failed to change', error);
                    }
                  });
                setRegLoading(false);
                loginSuccess();
                setTimeout(() => {
                  navigation.replace('mainScreens');
                }, 500);
              } else if (response.status == 202) {
                // this shouldn't be here. this should be in another app. this is to login admin
                const data = await response.data;
                await AsyncStorage.setItem('authToken', data.token);
                setRegLoading(false);
                navigation.replace('orderScreenForAdmin');
              }
            })
            .catch(error => {
              if (error.response.status == 304) {
                setRegisteredEmail(email);
                setRegLoading(false);
                navigation.navigate('verify');
              } else if (error.response.status === 404) {
                setRegLoading(false);
                emailPasswordError();
              } else if (error.response.status === 500) {
                showToastWithGravity('Server error');
                setRegLoading(false);
                unknownError();
              }
            });
        }
      }
    } catch (error) {
      setRegLoading(false);
      console.log(error);
    }
  };

  ///////

  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentBgColor,
      flex: 1,
      paddingHorizontal: 15,
    },
    textInput: {
      height: 50,
      borderRightColor: currentTextColor,
      borderWidth: 1.5,
      borderRadius: 10,
      marginVertical: 5,
      borderColor: currentTextColor,
      color: currentTextColor,
      fontSize: 17,
      padding: 15,
    },
    loginBtn: {
      backgroundColor: themeColor,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginTop: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View>
          <Image
            source={require('../../assets/levon-text.png')}
            style={{height: 50, width: 150}}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{gap: 10}}>
              <View style={{gap: 5}}>
                <View>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: emailIsEmpty
                          ? 'red'
                          : emailIsFocus
                          ? 'blue'
                          : currentTextColor,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={currentTextColor}
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                    keyboardType="email-address"
                    onFocus={() => setEmailIsFocus(true)}
                    onBlur={() => setEmailIsFocus(false)}
                  />
                  {!isValidEmail && (
                    <Text style={{color: 'red', fontSize: 16}}>
                      Invalid Email Address
                    </Text>
                  )}
                </View>

                <View style={{justifyContent: 'center'}}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: passwordIsEmpty
                          ? 'red'
                          : passwordIsFocus
                          ? 'blue'
                          : currentTextColor,
                      },
                    ]}
                    secureTextEntry={isPasswordVisible ? false : true}
                    placeholder="Password"
                    placeholderTextColor={currentTextColor}
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                    onFocus={() => setPasswordIsFocus(true)}
                    onBlur={() => setPasswordIsFocus(false)}
                  />
                  {!isValidPassword && (
                    <Text style={{color: 'red', fontSize: 16}}>
                      Invalid Password
                    </Text>
                  )}

                  <Pressable
                    onPress={() => setPasswordVisible(!isPasswordVisible)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      paddingRight: 10,
                      paddingBottom: !isValidPassword ? 20 : 0,
                    }}>
                    <Icon
                      name={isPasswordVisible ? 'eye-slash' : 'eye'}
                      color={currentTextColor}
                      size={20}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{color: currentTextColor, fontSize: 16}}>
                  Forgot Password?
                </Text>
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleLoginUser}
                disabled={regLoading ? true : false}>
                {regLoading ? (
                  <ActivityIndicator size={30} color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: '500',
                    }}>
                    LOGIN
                  </Text>
                )}
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5,
                  flexDirection: 'row',
                  gap: 5,
                  marginTop: 10,
                }}>
                <Text style={{color: currentTextColor, fontSize: 17}}>
                  Don't have an account?
                </Text>
                <Pressable onPress={() => navigation.navigate('register')}>
                  <Text
                    style={{
                      color: themeColor,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isInfoVisible && (
        <InfoBox message={message} iconName={alertIcon} bgColor={alertColor} />
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
