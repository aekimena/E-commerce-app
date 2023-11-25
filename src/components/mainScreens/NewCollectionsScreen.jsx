import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import ProductContext from '../../context/ProductContext';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {t} from 'react-native-tailwindcss';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const NewCollectionsScreen = ({navigation}) => {
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const {
    lightMode,
    newCollections,
    setProductId,
    handleNewValue,
    handleNewFavouriteValue,
    filteredNewCollections,
    setFilteredNewCollections,
  } = useContext(ProductContext);
  const [activeBtn, setActiveBtn] = useState(1);

  const handlePress = (id, btnText) => {
    setActiveBtn(id);
    setActiveCategory(btnText);
  };

  const renderBtn = (id, btnText) => {
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

  useEffect(() => {
    text.length !== 0 &&
      setFilteredNewCollections(
        newCollections.filter(
          item => item == item && item.category.indexOf(activeCategory) !== -1,
        ),
      );
    setFilteredNewCollections(
      newCollections.filter(
        item =>
          item.title.toLowerCase().includes(text.toLowerCase()) &&
          item.category.indexOf(activeCategory) !== -1,
      ),
    );
  }, [text, activeCategory]);

  const [scrollY] = useState(new Animated.Value(0));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [350, 100],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaProvider
      style={{backgroundColor: lightMode ? '#fff' : '#111', flex: 1}}>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        animated={true}
        translucent={true}
      />

      <Animated.View
        style={{
          alignItems: 'center',
          height: headerHeight,
          width: '100%',
        }}>
        <View style={styles.arrowSearchBar}>
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
              style={{position: 'absolute', zIndex: 10, marginLeft: 10}}
            />
            <View style={{flex: 1}}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                onChangeText={newText => setText(newText)}
                defaultValue={text}
                placeholderTextColor={'#fff'}
              />
            </View>
          </View>
        </View>

        <Image
          source={newCollections[0].source}
          style={{height: '100%', width: '100%'}}
          resizeMode="cover"
        />
        <View style={styles.layer}></View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>New Collections</Text>
        </View>
      </Animated.View>

      <ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        {/* <View
          style={{
            alignItems: 'center',
            height: 350,
            width: '100%',
          }}>
          <View style={styles.arrowSearchBar}>
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
                style={{position: 'absolute', zIndex: 10, marginLeft: 10}}
              />
              <View style={{flex: 1}}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Search..."
                  onChangeText={newText => setText(newText)}
                  defaultValue={text}
                  placeholderTextColor={'#fff'}
                />
              </View>
            </View>
          </View>

          <Image
            source={newCollections[0].source}
            style={{height: '100%', width: '100%'}}
            resizeMode="cover"
          />
          <View style={styles.layer}></View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>New Collections</Text>
          </View>
        </View> */}
        <View style={styles.selectorContainer}>
          <View
            style={[
              styles.selector,
              {
                elevation: lightMode ? 2 : 0,
                backgroundColor: lightMode ? '#fff' : 'transparent',
                borderWidth: lightMode ? 0 : 0.5,
              },
            ]}>
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

        <View style={styles.productsContainer}>
          {/*  */}
          {filteredNewCollections.map(product => (
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
                    {
                      right: 0,
                    },
                    styles.addLikeBg,
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
                    {
                      left: 0,
                    },
                    styles.addLikeBg,
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
                    t.roundedBLg,
                    styles.productInfoContainer,
                    {
                      backgroundColor: lightMode ? '#fff' : '#222',
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
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default NewCollectionsScreen;

const styles = StyleSheet.create({
  arrowSearchBar: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    zIndex: 20,
    paddingTop: 40,
    paddingHorizontal: 20,
    gap: 20,
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'transparent',
    color: '#fff',
    paddingLeft: 40,
    fontSize: 20,
    height: 53,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  layer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  titleContainer: {
    position: 'absolute',
    height: '100%',
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: '#fff',
    fontSize: 35,
    // fontWeight: 400,
    textAlignVertical: 'bottom',
    flex: 1,
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  selector: {
    borderRadius: 10,
    borderColor: '#fff',

    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 120,
    padding: 10,
    paddingVertical: 5,
  },
  productsContainer: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },

  addLikeBg: {
    backgroundColor: '#fff',
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
  productInfoContainer: {
    height: 90,
    elevation: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
});
