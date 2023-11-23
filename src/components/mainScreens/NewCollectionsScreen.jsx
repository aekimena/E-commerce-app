import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import ProductContext from '../../context/ProductContext';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {t} from 'react-native-tailwindcss';

const NewCollectionsScreen = ({navigation}) => {
  const [text, setText] = useState('');
  const {
    lightMode,
    newCollections,
    setProductId,
    handleNewValue,
    handleNewFavouriteValue,
  } = useContext(ProductContext);
  const [activeBtn, setActiveBtn] = useState(1);

  const handlePress = (id, btnText) => {
    setActiveBtn(id);
  };

  const renderBtn = (id, btnText) => {
    // const btnBg = activeBtn === id ? 'rgba(7, 23, 42, 1)' : '#fff';
    const btnBg = activeBtn === id ? '#36346C' : lightMode ? '#222' : '#fff';
    const activeIndicator = activeBtn === id ? '#36346c' : 'transparent';
    const activeFontWeight = activeBtn === id ? 'bold' : 500;

    return (
      <Pressable
        key={id}
        onPress={() => {
          handlePress(id, btnText);
        }}
        style={{
          paddingHorizontal: 5,
          alignItems: 'center',
          gap: 3,
        }}>
        <Text
          style={{color: btnBg, fontSize: 18, fontWeight: activeFontWeight}}>
          {btnText}
        </Text>
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: activeIndicator,
          }}></View>
      </Pressable>
    );
  };

  const handleDisplayProduct = product => {
    setProductId(product.id);
    navigation.navigate('ProductDisplay');
    console.log(product.id);
  };

  return (
    <View style={{backgroundColor: lightMode ? '#fff' : '#111', flex: 1}}>
      <StatusBar
        // backgroundColor={lightMode ? '#fff' : '#111'}
        backgroundColor={'transparent'}
        // barStyle={lightMode ? 'dark-content' : 'light-content'}
        animated={true}
        translucent={true}
      />
      <View></View>
      {/* scrollView */}
      <View
        style={{
          alignItems: 'center',

          height: 350,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            position: 'absolute',
            zIndex: 20,
            paddingTop: 40,
            paddingHorizontal: 20,
            gap: 20,

            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color={'#fff'} />
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
              color={'#fff'}
              style={[t.absolute, t.mL3, t.z10]}
            />
            <View style={{flex: 1}}>
              <TextInput
                style={[
                  t.p3,
                  {
                    backgroundColor: 'transparent',
                    color: '#fff',
                    paddingLeft: 40,
                    fontSize: 20,
                    height: 53,
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 10,
                  },
                ]}
                placeholder="Search products..."
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                placeholderTextColor={'#fff'}
              />
            </View>
          </View>
        </View>

        <Image
          source={newCollections[0].source}
          style={{height: '100%', width: '100%', resizeMode: 'cover'}}
        />
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: '100%',
            alignSelf: 'flex-end',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 35,
              fontWeight: 400,
              textAlignVertical: 'bottom',
              flex: 1,
            }}>
            New Collections
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 20,
        }}>
        <View
          style={{
            // borderColor: 'rgba(0,0,0,0.5)',
            // borderWidth: 0.5,
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: lightMode ? 0 : 0.5,
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 120,
            padding: 10,
            paddingVertical: 5,
            elevation: lightMode ? 2 : 0,
            backgroundColor: lightMode ? '#fff' : 'transparent',
          }}>
          <Text
            style={{
              color: lightMode ? '#222' : '#fff',
              fontWeight: '500',
              fontSize: 20,
            }}>
            Man
          </Text>
          <Icon
            name="chevron-down"
            color={lightMode ? '#222' : '#fff'}
            size={15}
          />
        </View>
      </View>
      <View style={{alignItems: 'center', marginBottom: 15}}>
        <ScrollView
          contentContainerStyle={{
            gap: 20,
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {renderBtn(1, 'All')}
          {renderBtn(2, 'Shoes')}
          {renderBtn(3, 'Bags')}
          {renderBtn(4, 'Tops')}
          {renderBtn(5, 'Trousers')}
          {renderBtn(6, 'Hats')}
        </ScrollView>
      </View>

      <View
        style={{
          paddingHorizontal: 15,
          // paddingVertical: 30,
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 15,
        }}>
        {/*  */}
        {newCollections.map(product => (
          <Pressable
            style={{
              width: '50%',

              marginBottom: 5,
            }}
            key={product.id}
            onPress={() => handleDisplayProduct(product)}>
            <View style={{padding: 5}}>
              <Image
                source={product.source}
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
                  handleNewFavouriteValue(
                    product.id,
                    product.favorite ? false : true,
                    product,
                  )
                }>
                <Icon
                  name="heart"
                  size={20}
                  color={product.favorite ? '#f66464' : '#36346C'}
                  solid={product.favorite ? true : false}
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
                    product.id,
                    product.addedToCart ? false : true,
                    product,
                  )
                }>
                <Icon
                  name={product.addedToCart ? 'check' : 'plus'}
                  size={20}
                  color={'#36346C'}
                  solid={false}
                />
              </Pressable>

              <View
                style={[
                  t.p2,
                  t.flexCol,
                  t.justifyBetween,
                  t.roundedBLg,
                  {
                    backgroundColor: lightMode ? '#fff' : '#222',
                    height: 90,
                    elevation: 1,
                  },
                ]}>
                <Text
                  style={{color: lightMode ? '#222' : '#fff', fontSize: 18}}
                  numberOfLines={2}
                  lineBreakMode="tail">
                  {product.title}
                </Text>
                <Text
                  style={{color: lightMode ? '#222' : '#fff', fontSize: 17}}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        {/*  */}
      </View>
    </View>
  );
};

export default NewCollectionsScreen;

const styles = StyleSheet.create({});
