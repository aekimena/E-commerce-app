import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {t} from 'react-native-tailwindcss';
import ProductContext from '../context/ProductContext';

const Favourites = ({navigation}) => {
  const {
    productId,
    products,
    setProductId,
    handleNewValue,
    handleNewFavouriteValue,
    favouriteItems,
    lightMode,
  } = useContext(ProductContext);
  const [text, setText] = useState('');

  const handleDisplayProduct = product => {
    setProductId(product.id);
    navigation.navigate('ProductDisplay');
    console.log(productId);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: lightMode ? '#fff' : '#111',
        // paddingHorizontal: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 15,
          // marginTop: 10,
          padding: 20,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={30}
            color={lightMode ? '#222' : '#fff'}
          />
        </Pressable>
        <View
          style={[
            t.flexRow,
            t.justifyCenter,
            t.itemsCenter,
            t.relative,
            {flex: 1},
          ]}>
          <Icon
            name="magnifying-glass"
            size={20}
            color={lightMode ? '#222' : '#fff'}
            style={{
              position: 'absolute',
              marginTop: 10,
              left: 0,
              marginLeft: 10,
              zIndex: 10,
            }}
          />
          <View style={{flex: 1}}>
            <TextInput
              style={[
                t.p3,
                t.relative,
                {
                  backgroundColor: lightMode ? 'rgba(0, 0, 0, 0.05)' : '#222',
                  color: lightMode ? '#222' : '#fff',
                  paddingLeft: 40,
                  fontSize: 20,
                  height: 53,
                  borderRadius: 10,
                },
              ]}
              placeholder="Search favourites..."
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              placeholderTextColor={lightMode ? '#222' : '#fff'}
            />
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginVertical: 10,
            paddingHorizontal: 15,
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {favouriteItems?.length > 0 &&
            favouriteItems.map(item => (
              //
              <Pressable
                style={{
                  width: '50%',
                  // height: '100%',
                  // margin: 3,

                  marginBottom: 5,
                }}
                key={item.id}
                onPress={() => handleDisplayProduct(item)}>
                <View style={{padding: 5}}>
                  <Image
                    // source={{uri: product.image}}
                    source={item.source}
                    // style={[t.wFull, t.h100, t.roundedTLg]}
                    style={{
                      width: '100%',
                      height: 200,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                    resizeMode="contain"
                  />

                  <Pressable
                    style={[
                      t.absolute,
                      t.top2,
                      t.right0,

                      t.h8,
                      t.w8,
                      t.m3,
                      t.roundedFull,
                      t.itemsCenter,
                      t.justifyCenter,
                      t.flexCol,
                      {backgroundColor: '#f7fafc'},
                    ]}
                    onPress={() =>
                      handleNewFavouriteValue(item.id, false, item)
                    }>
                    <Icon
                      name="heart"
                      size={20}
                      // color={item.favorite ? '#ff2525' : '#07172a'}
                      color={
                        products[products.findIndex(obj => obj.id === item.id)]
                          .favorite
                          ? 'rgba(255, 37, 37, 0.6)'
                          : '#07172a'
                      }
                      solid={
                        products[products.findIndex(obj => obj.id === item.id)]
                          .favorite
                          ? true
                          : false
                      }
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      t.absolute,
                      t.top0,
                      t.left0,

                      t.h8,
                      t.w8,
                      t.m3,
                      t.roundedFull,
                      t.itemsCenter,
                      t.justifyCenter,
                      t.flexCol,
                      {backgroundColor: '#fff'},
                    ]}
                    onPress={() =>
                      handleNewValue(
                        item.id,
                        item.addedToCart ? false : true,
                        item,
                      )
                    }>
                    <Icon
                      name={
                        products[products.findIndex(obj => obj.id === item.id)]
                          .addedToCart
                          ? 'check'
                          : 'plus'
                      }
                      size={20}
                      // color={'#FF8119'}
                      color={'#07172a'}
                      solid={false}
                    />
                  </Pressable>

                  <View
                    style={[
                      t.p2,
                      t.flexCol,
                      t.justifyBetween,
                      t.roundedBLg,
                      t.shadowMd,
                      {
                        backgroundColor: lightMode ? '#fff' : '#222',
                        height: 90,
                        elevation: 1,
                      },
                      // t.itemsCenter,
                    ]}>
                    <Text
                      style={{color: lightMode ? '#222' : '#fff', fontSize: 18}}
                      numberOfLines={2}
                      lineBreakMode="tail">
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        color: lightMode ? '#222' : '#fff',
                        fontSize: 17,
                      }}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Pressable>
              //
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'transparent',
    height: 55,
    width: 55,
    borderRadius: 27.5,
    borderWidth: 0.5,
    borderColor: '#07172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
