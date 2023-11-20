import {View, Text, TextInput, ScrollView, Pressable} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {t} from 'react-native-tailwindcss';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ProductContext from '../../context/ProductContext';

import Products from '../Products';

const Home = ({navigation}) => {
  const {products, favouriteItems, setFilteredProducts, drawer, lightMode} =
    useContext(ProductContext);
  const [text, setText] = useState('');
  const [activeBtn, setActiveBtn] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  const handlePress = (id, btnText) => {
    setActiveBtn(id);

    setActiveCategory(btnText);
    console.log(btnText);
  };
  const renderBtn = (id, btnText) => {
    // const btnBg = activeBtn === id ? 'rgba(7, 23, 42, 1)' : '#fff';
    const btnBg =
      activeBtn === id ? '#36346C' : lightMode ? '#fff' : 'transparent';

    const btnCol = activeBtn === id ? '#fff' : lightMode ? '#222' : '#fff';
    const bdCol = activeBtn === id ? '#36346c' : lightMode ? '#222' : '#fff';

    return (
      <Pressable
        key={id}
        onPress={() => {
          handlePress(id, btnText);
        }}
        style={[
          t.roundedFull,
          t.h12,
          t.justifyCenter,
          t.itemsCenter,
          t.pX8,
          {
            backgroundColor: btnBg,
            borderColor: bdCol,
            borderWidth: 0.4,
          },
        ]}>
        <Text style={{color: btnCol, fontSize: 18}}>{btnText}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    text.length !== 0 &&
      setFilteredProducts(
        products.filter(
          item => item == item && item.category.indexOf(activeCategory) !== -1,
        ),
      );
    setFilteredProducts(
      products.filter(
        item =>
          item.title.toLowerCase().includes(text.toLowerCase()) &&
          item.category.indexOf(activeCategory) !== -1,
      ),
    );
  }, [text, activeCategory]);

  return (
    <View style={{backgroundColor: lightMode ? '#fff' : '#111', flex: 1}}>
      <View style={[t.flexCol, t.pX5, t.pY3, t.hAuto, {gap: 20}]}>
        <View
          style={[
            t.flexRow,
            t.justifyBetween,
            t.itemsCenter,
            {paddingTop: 10},
          ]}>
          <Pressable onPress={() => drawer.current.openDrawer()}>
            <Icon
              name="bars-staggered"
              size={30}
              color={lightMode ? '#222' : '#fff'}
            />
          </Pressable>

          <View style={[t.flex, t.flexRow, {gap: 25}]}>
            {/* <Icon name="bell" size={30} color={'#07172a'} solid={true} /> */}
            <Pressable onPress={() => navigation.navigate('favourites')}>
              {/*  */}
              {favouriteItems?.length > 0 && (
                <View
                  style={[
                    t.roundedFull,
                    t.flex,
                    t.justifyCenter,
                    t.itemsCenter,
                    // t.p3,
                    {
                      backgroundColor: '#f66464',
                      position: 'absolute',
                      height: 25,
                      width: 25,
                      bottom: 20,
                      left: 18,
                      zIndex: 10,
                    },
                  ]}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 'bold',
                      // padding: 3,
                    }}>
                    {favouriteItems.length}
                  </Text>
                </View>
              )}
              {/*  */}
              <Icon
                name="heart"
                size={30}
                color={lightMode ? '#222' : '#fff'}
              />
            </Pressable>
          </View>
        </View>
        <View style={[t.flexRow, t.justifyCenter, t.itemsCenter, t.relative]}>
          <Icon
            name="magnifying-glass"
            size={20}
            color={lightMode ? '#222' : '#fff'}
            style={[t.absolute, t.mT10, t.left0, t.mL3, t.z10]}
          />
          <View style={[t.flex1]}>
            <TextInput
              style={[
                t.p3,
                t.relative,
                {
                  // backgroundColor: '#E2E7EE',
                  backgroundColor: lightMode ? 'rgba(0, 0, 0, 0.05)' : '#222',
                  color: lightMode ? '#222' : '#fff',
                  paddingLeft: 40,
                  fontSize: 20,
                  height: 53,
                  borderRadius: 10,
                },
              ]}
              placeholder="Search products..."
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              placeholderTextColor={lightMode ? '#222' : '#fff'}
            />
          </View>
          {/* <View
            style={[
              t.flexCol,
              t.itemsCenter,
              t.justifyCenter,
              t.mL3,
              {backgroundColor: '#E2E7EE', height: 53, borderRadius: 10},
            ]}>
            <Icon name="sliders" size={25} color={'#888'} style={[t.p3]} />
          </View> */}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          contentContainerStyle={[
            t.flex,
            t.flexRow,
            t.justifyEvenly,
            t.itemsCenter,
            t.mT2,
            t.mB5,
            t.pX5,
            {gap: 10},
          ]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {renderBtn(1, 'All')}
          {renderBtn(2, 'Shoes')}
          {renderBtn(3, 'Bags')}
          {renderBtn(4, 'Tops')}
          {renderBtn(5, 'Hats')}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 15,
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 15,
          }}>
          <Products navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
