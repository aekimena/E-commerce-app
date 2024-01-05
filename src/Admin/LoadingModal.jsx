import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useContext} from 'react';
import Modal from 'react-native-modal';

const LoadingModal = ({modalVisible}) => {
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
              backgroundColor: '#fff',
              height: 120,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <ActivityIndicator color={'#222'} size={50} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({});
