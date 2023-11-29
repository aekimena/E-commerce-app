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

const NewCollectionsScreen = ({navigation}) => {
  const [text, setText] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(1);

  const {
    theme,
    newCollections,
    setProductId,
    allProducts,
    cartUpdate,
    handleNewFavouriteValue,
    filteredNewCollections,
    cartItems,
  } = useContext(ProductContext);
  // const [activeBtn, setActiveBtn] = useState(1);

  const categories = [
    {id: 1, content: 'All'},
    {id: 2, content: 'Shoes'},
    {id: 3, content: 'Bags'},
    {id: 4, content: 'Tops'},
    {id: 5, content: 'Trousers'},
    {id: 6, content: 'Hats'},
  ];

  const handlePress = id => {
    setActiveCategoryId(id);
  };

  const renderBtn = category => {
    const btnBg =
      activeCategoryId === category.id
        ? '#6236FF'
        : theme == 'light'
        ? '#222'
        : '#fff';
    const activeIndicator =
      activeCategoryId === category.id ? '#6236FF' : 'transparent';
    const activeFontWeight = activeCategoryId === category.id ? 'bold' : 500;

    return (
      <Pressable
        key={category.id}
        onPress={() => {
          handlePress(category.id);
        }}
        style={{
          paddingHorizontal: 5,
          alignItems: 'center',
          gap: 3,
        }}>
        <Text
          style={{color: btnBg, fontSize: 18, fontWeight: activeFontWeight}}>
          {category.content}
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

  const Options = [
    {id: 1, gender: 'Man'},
    {id: 2, gender: 'Woman'},
  ];

  const [activeOptionId, setActiveOptionId] = useState(1);

  const [optionsBoxClosed, setOptionBoxClosed] = useState(true);

  const optionPress = id => {
    setActiveOptionId(id);
    setOptionBoxClosed(true);
  };

  const dropDownPress = () => {
    setOptionBoxClosed(optionsBoxClosed ? false : true);
  };

  return (
    <View
      style={{backgroundColor: theme == 'light' ? '#fff' : '#111', flex: 1}}>
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
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            height: 200,
            width: '100%',
          }}>
          <Image
            source={newCollections[0].imageSource}
            style={{height: '100%', width: '100%'}}
            resizeMode="cover"
          />
          <View style={styles.layer}></View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, {fontWeight: 300}]}>
              New Collections
            </Text>
          </View>
        </View>
        <View style={styles.selectorContainer}>
          <View
            style={{
              alignItems: 'center',
              width: 120,
              position: 'absolute',
              top: 0,
            }}>
            <Pressable
              style={[
                styles.selector,
                {
                  elevation: 2,
                  backgroundColor: theme == 'light' ? '#fff' : '#111',
                },
              ]}
              onPress={dropDownPress}>
              <Text
                style={{
                  color: theme == 'light' ? '#222' : '#fff',
                  fontWeight: '500',
                  fontSize: 20,
                }}>
                {
                  Options[Options.findIndex(obj => obj.id == activeOptionId)]
                    .gender
                }
              </Text>
              <Icon
                name={optionsBoxClosed ? 'chevron-down' : 'chevron-up'}
                color={theme == 'light' ? '#222' : '#fff'}
                size={15}
              />
            </Pressable>
            <View
              style={{
                backgroundColor: theme == 'light' ? '#fff' : '#222',
                elevation: 4,
                height: 'auto',
                width: '100%',
                zIndex: 20,
                display: optionsBoxClosed ? 'none' : 'flex',
              }}>
              {Options.map(option => (
                <Pressable
                  style={{
                    backgroundColor:
                      option.id == activeOptionId
                        ? theme == 'light'
                          ? 'rgba(7, 23, 42, 0.08)'
                          : '#444'
                        : 'transparent',
                    width: '100%',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}
                  key={option.id}
                  onPressIn={() => optionPress(option.id)}>
                  <Text
                    style={{
                      color: theme == 'light' ? '#222' : '#fff',
                      fontSize: 20,
                      fontWeight: 400,
                    }}>
                    {option.gender}
                  </Text>
                </Pressable>
              ))}
            </View>
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
            {categories.map(category => renderBtn(category))}
          </ScrollView>
        </View>

        <View style={styles.productsContainer}>
          {/*  */}
          {filteredNewCollections
            .filter(
              item =>
                (item.title.toLowerCase().includes(text.toLowerCase()) ||
                  item.description.toLowerCase().includes(text.toLowerCase()) ||
                  item.keywords.includes(text.toLowerCase())) &&
                item.gender.includes(
                  Options[Options.findIndex(obj => obj.id == activeOptionId)]
                    .gender,
                ) &&
                item.category.includes(
                  categories[
                    categories.findIndex(obj => obj.id == activeCategoryId)
                  ].content,
                ),
            )
            .map(product => (
              <Pressable
                style={{
                  width: '50%',
                  paddingHorizontal: 5,
                  marginBottom: 5,
                }}
                key={product.id}
                onPress={() => handleDisplayProduct(product)}>
                <View style={{padding: 5}}>
                  <Image
                    source={product.imageSource}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 0.1,
                    }}
                    resizeMode="cover"
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
                        allProducts[
                          allProducts.findIndex(obj => obj.id == product.id)
                        ].liked
                          ? false
                          : true,
                        product,
                      )
                    }>
                    <Icon
                      name="heart"
                      size={20}
                      color={
                        allProducts[
                          allProducts.findIndex(obj => obj.id == product.id)
                        ].liked
                          ? '#f66464'
                          : '#fff'
                      }
                      solid={
                        allProducts[
                          allProducts.findIndex(obj => obj.id == product.id)
                        ].liked
                          ? true
                          : false
                      }
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
                      cartUpdate(
                        cartItems.includes(product.id) ? false : true,
                        product,
                      )
                    }>
                    <Icon
                      name={cartItems.includes(product.id) ? 'check' : 'plus'}
                      size={20}
                      color={'#fff'}
                      solid={false}
                    />
                  </Pressable>

                  <View
                    style={[
                      // t.roundedBLg,
                      styles.productInfoContainer,
                      {
                        backgroundColor: 'transparent',
                      },
                    ]}>
                    <Text
                      style={{
                        color: theme == 'light' ? '#222' : '#fff',
                        fontSize: 18,
                      }}
                      numberOfLines={1}
                      lineBreakMode="tail">
                      {product.title}
                    </Text>

                    <Text
                      style={{
                        color: theme == 'light' ? '#888' : '#999',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      <Icon name="naira-sign" size={15} />
                      {product.price}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          {/*  */}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewCollectionsScreen;

const styles = StyleSheet.create({
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
  layer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  titleContainer: {
    position: 'absolute',
    height: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 35,
    // fontWeight: 400,
    textAlignVertical: 'center',
    flex: 1,
  },
  selectorContainer: {
    // flexDirection: 'row',
    // gap: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
    marginRight: 20,
    marginVertical: 20,
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
  productInfoContainer: {
    height: 'auto',
    gap: 10,
    // elevation: 1,
    justifyContent: 'space-between',
    padding: 5,
  },
});
