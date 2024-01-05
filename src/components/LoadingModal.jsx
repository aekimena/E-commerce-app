import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useContext} from 'react';
import Modal from 'react-native-modal';
import {Theme} from '../context/themeContext';

const LoadingModal = ({modalVisible}) => {
  const {currentBgColor, currentTextColor} = useContext(Theme);
  return (
    <View>
      <Modal
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInTiming={100}
        useNativeDriverForBackdrop
        animationOutTiming={100}
        isVisible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
          }}>
          <View
            style={{
              backgroundColor: currentBgColor,
              height: 120,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <ActivityIndicator color={currentTextColor} size={50} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({});
