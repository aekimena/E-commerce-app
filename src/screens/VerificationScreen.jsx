import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useState, useRef} from 'react';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import {Theme} from '../context/themeContext';
import {GeneralContext} from '../context/generalContext';
import messaging from '@react-native-firebase/messaging';

const themeColor = '#6236FF';

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

const VerifyCode = () => {
  const {registeredEmail, setRegisteredEmail} = useContext(GeneralContext);
  const {currentTextColor, currentBgColor} = useContext(Theme);
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [isValidCode, setIsValidCode] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState(null);
  const [alertColor, setAlertColor] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [resendBtnActive, setResendBtnActive] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef(countdown);
  const [textinputIsFocus, setTextinputIsFocus] = useState(false);

  function showInfo() {
    setIsInfoVisible(true);
    setTimeout(() => {
      setIsInfoVisible(false);
    }, 2000);
  }

  function incorrectError() {
    setMessage('Incorrect verification code.');
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

  function emailVerified() {
    setMessage('Email verified.');
    setAlertIcon('check');
    setAlertColor('#003609');
    showInfo();
  }

  function validateCode() {
    setIsValidCode(code.length == 6);
    return code.length == 6;
  }

  function startCountdown() {
    setResendBtnActive(true);
    timerRef.current = 60;
    const countdownInterval = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current == 0) {
        timerRef.current = 60;
        setResendBtnActive(false);
        clearInterval(countdownInterval);
      } else {
        setCountdown(timerRef.current);
      }
    }, 1000);
  }

  useEffect(() => {
    startCountdown();
  }, []);

  const handleVerification = async () => {
    const user = {
      email: registeredEmail,
      verificationCode: code,
    };

    try {
      if (validateCode()) {
        setRegLoading(true);
        const response = await fetch('http://localhost:8000/register/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if (response) {
          if (response.status == 200) {
            const data = await response.json();
            await AsyncStorage.setItem('authToken', data.token);

            const deviceToken = await messaging().getToken();
            const authToken = await AsyncStorage.getItem('authToken');
            const decoded = jwtDecode(authToken);

            //store device token in database
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
            setRegisteredEmail('');
            emailVerified();
            setTimeout(() => {
              navigation.replace('mainScreens');
            }, 500);
          } else if (response.status === 404) {
            setRegLoading(false);
            unknownError();
          } else if (response.status === 400) {
            setRegLoading(false);
            incorrectError();
          } else if (response.status === 500) {
            setRegLoading(false);
            unknownError();
          }
        }
      }
    } catch (error) {
      console.log(error);
      setRegLoading(false);
    }
  };

  // function to resend verification code

  const handleResendCode = async () => {
    const user = {
      email: registeredEmail,
    };

    try {
      setSendingCode(true);
      startCountdown();
      const response = await fetch(
        'http://localhost:8000/register/verify/resend-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        },
      );
      if (response.status === 200) {
        setSendingCode(false);
      }
    } catch (error) {
      console.log(error);
      setSendingCode(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentBgColor,
      flex: 1,
      paddingHorizontal: 15,
    },
    textInput: {
      height: 50,
      borderWidth: 1,
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            height: 50,
            width: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: currentTextColor,
            borderWidth: 1,
          }}>
          <Icon name="chevron-left" size={25} color={currentTextColor} />
        </TouchableOpacity>

        <View>
          <View>
            <Image
              source={require('../../assets/levon-text.png')}
              style={{height: 50, width: 150}}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <View
            style={{
              // alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            {sendingCode ? (
              <View style={{alignSelf: 'center'}}>
                <ActivityIndicator size={30} color="#222" />
              </View>
            ) : (
              <>
                <Text
                  style={{
                    color: currentTextColor,
                    textAlign: 'left',
                    fontSize: 25,
                    fontWeight: '500',
                  }}>
                  We sent you a code{' '}
                </Text>
                <Text
                  style={{
                    color: currentTextColor,
                    fontSize: 20,
                    marginTop: 10,
                  }}>
                  Enter it below to verify your email
                </Text>
              </>
            )}
          </View>
          <View style={{gap: 10}}>
            <View>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: textinputIsFocus
                      ? 'blue'
                      : !validateCode
                      ? 'red'
                      : currentTextColor,
                  },
                ]}
                placeholder="Verification code"
                placeholderTextColor={currentTextColor}
                onChangeText={newText => setCode(newText)}
                defaultValue={code}
                onFocus={() => setTextinputIsFocus(true)}
                onBlur={() => setTextinputIsFocus(false)}
              />
              {!isValidCode && (
                <Text style={{color: 'red', fontSize: 16}}>
                  Invalid verification code
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleVerification}>
              {regLoading ? (
                <ActivityIndicator size={30} color="#fff" />
              ) : (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  VERIFY
                </Text>
              )}
            </TouchableOpacity>
            <Pressable
              disabled={resendBtnActive ? true : false}
              onPress={handleResendCode}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 5,
                marginTop: 10,
                opacity: resendBtnActive ? 0.5 : 1,
              }}>
              <Text style={{color: currentTextColor, fontSize: 16}}>
                Resend code
              </Text>
              <Text
                style={{
                  color: themeColor,
                  fontSize: 16,
                  fontWeight: '500',
                  display: resendBtnActive ? 'flex' : 'none',
                }}>
                {timerRef.current}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      {isInfoVisible && (
        <InfoBox message={message} iconName={alertIcon} bgColor={alertColor} />
      )}
    </SafeAreaView>
  );
};

export default VerifyCode;
