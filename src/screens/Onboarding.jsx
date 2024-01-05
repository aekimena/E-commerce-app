import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const themeColor = '#6236FF';
const Onboarding = () => {
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const scrollRef = useRef();
  const [pageNo, setPageNo] = useState(0);
  function handleScroll(event) {
    null;
  }

  const TextDisplay = ({h, p}) => {
    return (
      <View style={{gap: 10, paddingHorizontal: 25}}>
        <Text
          style={{
            color: '#222',
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'left',
          }}>
          {h}
        </Text>
        <Text
          style={{
            color: '#222',
            fontSize: 22,
            fontWeight: '500',
            textAlign: 'left',
          }}>
          {p}
        </Text>
      </View>
    );
  };

  const scrollToPage = pageNumber => {
    if (scrollRef.current) {
      const offsetX = pageNumber * Dimensions.get('window').width;
      scrollRef.current.scrollTo({x: offsetX, animated: true});
    }
  };

  function scrollNext() {
    if (pageNo == 0) {
      scrollToPage(1);
      setPageNo(1);
    } else if (pageNo == 1) {
      scrollToPage(2);
      setPageNo(2);
    }
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />

      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        nestedScrollEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <View
          style={{
            width: window.width,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={require('../../assets/onboarding-images/img-1.png')}
            resizeMode="contain"
            style={{width: '100%', height: 450}}
          />
          <TextDisplay
            h={'Find Favourite Items'}
            p={"Find your favourite products you'd like to buy easily"}
          />
        </View>
        {/* page 2 */}
        <View
          style={{
            width: window.width,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={require('../../assets/onboarding-images/img-2.png')}
            resizeMode="contain"
            style={{width: '100%', height: 450}}
          />
          <TextDisplay
            h={'Easy and Safe Payment'}
            p={"Pay for the products you'd like to buy easily"}
          />
        </View>
        {/* page 3 */}
        <View
          style={{
            width: window.width,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={require('../../assets/onboarding-images/img-3.png')}
            resizeMode="contain"
            style={{width: '100%', height: 450}}
          />
          <TextDisplay
            h={'Enjoy your Shopping'}
            p={'Have fun finding what suits you best on Levon'}
          />
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 25,
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', gap: 15}}>
          <View
            style={{
              backgroundColor: pageNo == 0 ? themeColor : '#999',
              height: 12,
              width: 12,
              borderRadius: 6,
            }}></View>
          <View
            style={{
              backgroundColor: pageNo == 1 ? themeColor : '#999',
              height: 12,
              width: 12,
              borderRadius: 6,
            }}></View>
          <View
            style={{
              backgroundColor: pageNo == 2 ? themeColor : '#999',
              height: 12,
              width: 12,
              borderRadius: 6,
            }}></View>
        </View>
        <Pressable
          onPress={() =>
            pageNo == 2 ? navigation.navigate('login') : scrollNext()
          }
          style={{
            width: 'auto',
            height: 'auto',
            backgroundColor: themeColor,
            paddingHorizontal: 35,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <Text style={{color: '#fff', fontSize: 25, fontWeight: '500'}}>
            {pageNo == 2 ? 'Get started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({});
