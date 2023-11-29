import {
  StyleSheet,
  TextInput,
  StatusBar,
  Pressable,
  View,
  Text,
  Image,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ProductContext from '../../context/ProductContext';
import {ScrollView} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const SearchScreen = ({navigation}) => {
  const {theme, filteredProducts, productId, setProductId} =
    useContext(ProductContext);
  const [text, setText] = useState('');

  const handleDisplayProduct = item => {
    setProductId(item.id);
    navigation.navigate('ProductDisplay');
  };
  const singleTap = item =>
    Gesture.Tap()
      .numberOfTaps(1)
      .maxDuration(0.3)
      .onEnd(() => {
        runOnJS(handleDisplayProduct)(item);
      });
  return (
    <View
      style={{flex: 1, backgroundColor: theme == 'light' ? '#fff' : '#111'}}>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        animated={true}
        translucent={true}
      />
      <View
        style={{
          backgroundColor: theme == 'light' ? '#fff' : '#111',
          height: 110,
          justifyContent: 'center',
        }}>
        <View style={styles.arrowSearchBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={30}
              color={theme == 'light' ? '#222' : '#fff'}
            />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <Icon
              name="magnifying-glass"
              size={20}
              color={theme == 'light' ? '#222' : '#fff'}
              style={{position: 'absolute', zIndex: 10, marginLeft: 10}}
            />
            <View style={{flex: 1}}>
              <TextInput
                style={[
                  styles.searchBar,
                  {
                    borderColor: theme == 'light' ? '#222' : '#fff',
                    color: theme == 'light' ? '#222' : '#fff',
                  },
                ]}
                placeholder="Search..."
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                placeholderTextColor={theme == 'light' ? '#222' : '#fff'}
              />
            </View>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{gap: 15, paddingBottom: 20}}>
        {text.length !== 0 &&
          filteredProducts
            .filter(
              item =>
                item.title.toLowerCase().includes(text.toLowerCase()) ||
                item.description.toLowerCase().includes(text.toLowerCase()) ||
                item.keywords.includes(text.toLowerCase()),
            )
            .map(product => (
              <GestureDetector
                gesture={Gesture.Exclusive(singleTap(product))}
                key={product.id}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    paddingVertical: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                      gap: 20,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={product.imageSource}
                      resizeMode={'contain'}
                      style={{height: 100, width: 100, borderRadius: 10}}
                    />
                    <View style={{gap: 10}}>
                      <Text
                        style={{
                          color: theme == 'light' ? '#222' : '#fff',
                          fontWeight: 'bold',
                          fontSize: 20,
                        }}>
                        {product.title}
                      </Text>
                      <Text
                        style={{
                          color: theme == 'light' ? '#888' : '#999',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Woman/Shoes
                      </Text>
                      <Text
                        style={{
                          color: theme == 'light' ? '#888' : '#999',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        <Icon name="naira-sign" size={15} />
                        {product.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </GestureDetector>
            ))}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  // arrowSearchBar: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   gap: 15,
  //   padding: 20,
  // },

  arrowSearchBar: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 25,
    paddingHorizontal: 20,
    gap: 20,
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'transparent',
    color: '#fff',
    paddingLeft: 40,
    fontSize: 20,
    height: 50,
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
  },

  searchIconSearchBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    marginTop: 10,
    left: 0,
    marginLeft: 10,
    zIndex: 10,
  },
  // searchBar: {
  //   paddingLeft: 40,
  //   fontSize: 20,
  //   height: 53,
  //   borderRadius: 10,
  // },
});
