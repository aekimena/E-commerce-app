import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {t} from 'react-native-tailwindcss';
import ProductContext from '../context/ProductContext';

const Favourites = ({navigation}) => {
  const {
    productId,
    allProducts,
    setProductId,
    cartUpdate,
    handleNewFavouriteValue,
    favouriteItems,
    theme,
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
        backgroundColor: theme == 'light' ? '#fff' : '#111',
      }}>
      <StatusBar
        backgroundColor={theme == 'light' ? '#fff' : '#111'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        animated={true}
        translucent={false}
      />
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
            color={theme == 'light' ? '#222' : '#fff'}
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
            color={theme == 'light' ? '#222' : '#fff'}
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
                  backgroundColor:
                    theme == 'light' ? 'rgba(0, 0, 0, 0.05)' : '#222',
                  color: theme == 'light' ? '#222' : '#fff',
                  paddingLeft: 40,
                  fontSize: 20,
                  height: 53,
                  borderRadius: 10,
                },
              ]}
              placeholder="Search favourites..."
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              placeholderTextColor={theme == 'light' ? '#222' : '#fff'}
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

                  marginBottom: 5,
                }}
                key={item.id}
                onPress={() => handleDisplayProduct(item)}>
                <View style={{padding: 5}}>
                  <Image
                    source={item.source}
                    style={{
                      width: '100%',
                      height: 200,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                    resizeMode="contain"
                  />

                  <Pressable
                    style={[styles.addLikeBg, {right: 0}]}
                    onPress={() =>
                      handleNewFavouriteValue(item.id, false, item)
                    }>
                    <Icon
                      name="heart"
                      size={20}
                      color={
                        allProducts[
                          allProducts.findIndex(obj => obj.id === item.id)
                        ].liked
                          ? 'rgba(255, 37, 37, 0.6)'
                          : '#fff'
                      }
                      solid={
                        allProducts[
                          allProducts.findIndex(obj => obj.id === item.id)
                        ].liked
                          ? true
                          : false
                      }
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.addLikeBg, {left: 0}]}
                    onPress={() =>
                      cartUpdate(
                        item.id,
                        allProducts[
                          allProducts.findIndex(obj => obj.id === item.id)
                        ].addedToCart
                          ? false
                          : true,
                        item,
                      )
                    }>
                    <Icon
                      name={
                        allProducts[
                          allProducts.findIndex(obj => obj.id === item.id)
                        ].addedToCart
                          ? 'check'
                          : 'plus'
                      }
                      size={20}
                      // color={'#FF8119'}
                      color={'#fff'}
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
                        backgroundColor: theme == 'light' ? '#fff' : '#222',
                        height: 'auto',
                        gap: 10,
                        elevation: 1,
                      },
                      // t.itemsCenter,
                    ]}>
                    <Text
                      style={{
                        color: theme == 'light' ? '#222' : '#fff',
                        fontSize: 18,
                      }}
                      numberOfLines={1}
                      lineBreakMode="tail">
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        color: theme == 'light' ? '#222' : '#fff',
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
  addLikeBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 2,
    right: 0,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
