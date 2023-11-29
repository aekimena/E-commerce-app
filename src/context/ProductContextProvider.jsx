import React, {useState, useRef, useEffect} from 'react';
import ProductContext from './ProductContext';
import {productsArray} from '../arrays/Products';
import {newCollectionsIds} from '../arrays/Products';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContextProvider = ({children}) => {
  const [allProducts, setAllProducts] = useState(
    productsArray.map(item => ({
      id: item.id,
      description: item.description,
      title: item.title,
      price: item.price,
      increaseAmount: item.price,
      imageSource: item.source,
      chosenColor: '',
      chosenSize: '',
      stock: item.stock,
      rating: 0,
      liked: false,
      sizes: item.sizes,
      colors: item.colors,
      addedToCart: false,
      category: item.category,
      keywords: item.keywords,
      gender: item.gender,
      quantity: 1,
    })),
  );

  const [newCollections, setNewCollections] = useState(
    allProducts.filter(item => newCollectionsIds.includes(item.id)),
  );
  const [cartItems, setCartItems] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [favouriteItems, setFavouritesItems] = useState([]);
  const [productId, setProductId] = useState(null);

  const renderedCartItem = cartItem => {
    return allProducts[allProducts.findIndex(obj => obj.id == cartItem)];
  };
  const updatedObject = item => {
    return {
      id: renderedCartItem(item).id,
      description: renderedCartItem(item).description,
      title: renderedCartItem(item).title,
      price: renderedCartItem(item).price,
      increaseAmount: renderedCartItem(item).price,
      imageSource: renderedCartItem(item).imageSource,
      stock: renderedCartItem(item).stock,
      quantity: 1,
    };
  };

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filteredNewCollections, setFilteredNewCollections] =
    useState(newCollections);
  const drawer = useRef(null);
  const refRBSheet = useRef();

  const [theme, setTheme] = useState('light');

  const addToCartAndStorage = (product, newObj) => {
    setCartItems([...cartItems, product.id]);
    setCartArray([...cartArray, newObj]);
  };

  const deleteFromCartAndStorage = product => {
    setCartItems(cartItems.filter(item => item !== product.id));
    setCartArray(cartArray.filter(item => item.id !== product.id));
  };

  const cartUpdate = (newValue, product) => {
    const newObject = {
      id: product.id,
      title: renderedCartItem(product.id).title,
      price: renderedCartItem(product.id).price,
      increaseAmount: renderedCartItem(product.id),
      imageSource: renderedCartItem(product.id).imageSource,
      stock: renderedCartItem(product.id).stock,
      quantity: 1,
    };
    newValue
      ? addToCartAndStorage(product, newObject)
      : deleteFromCartAndStorage(product);
  };

  const handleNewFavouriteValue = (id, newValue, addedIem) => {
    const newFavouriteItem = {
      id: addedIem.id,
      title: allProducts[allProducts.findIndex(obj => obj.id == id)].title,
      price: allProducts[allProducts.findIndex(obj => obj.id == id)].price,
      favorite: allProducts[allProducts.findIndex(obj => obj.id == id)].liked,
      source:
        allProducts[allProducts.findIndex(obj => obj.id == id)].imageSource,
      addedToCart:
        allProducts[allProducts.findIndex(obj => obj.id == id)].addedToCart,
    };
    setAllProducts(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, liked: newValue} : item,
      ),
    );

    newValue
      ? setFavouritesItems([...favouriteItems, newFavouriteItem])
      : setFavouritesItems(
          favouriteItems.filter(item => item.id !== addedIem.id),
        );
  };
  const handleAddQuantityValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, quantity: (item.quantity += 1)} : item,
      ),
    );
  };

  const handleMinusQuantityValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, quantity: (item.quantity -= 1)} : item,
      ),
    );
  };
  const handleAddPriceValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id
          ? {...item, price: (item.price += item.increaseAmount)}
          : item,
      ),
    );
  };

  const handleMinusPriceValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id
          ? {...item, price: (item.price -= item.increaseAmount)}
          : item,
      ),
    );
  };

  const handleAddBtn = item => {
    item.quantity < item.stock
      ? (handleAddQuantityValue(item.id), handleAddPriceValue(item.id))
      : setCartArray(prevData =>
          prevData.map(item => item.id == item.id && item),
        );
  };
  const handleMinusBtn = item => {
    item.quantity > 1
      ? (handleMinusQuantityValue(item.id), handleMinusPriceValue(item.id))
      : setCartArray(prevData =>
          prevData.map(item => item.id == item.id && item),
        );
  };

  const newRating = (id, rating) => {
    setAllProducts(prevData =>
      prevData.map(item => (item.id === id ? {...item, rating: rating} : item)),
    );
  };

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      }
    }

    loadTheme();

    async function loadCart() {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartItems(
            JSON.parse(savedCart).filter(
              item => allProducts.findIndex(obj => obj.id == item) !== -1,
            ),
          );
          setCartArray(JSON.parse(savedCart).map(item => updatedObject(item)));
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      }
    }
    loadCart();
  }, []);

  // async function clearItem() {
  //   try {
  //     await AsyncStorage.removeItem('cart');
  //     console.log('removed');
  //   } catch (error) {
  //     console.log('error');
  //   }
  // }

  // clearItem();

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cartItems)).catch(error => {
      console.error('Error saving cart to AsyncStorage:', error);
    });
  }, [cartItems]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme).catch(error => {
      console.error('Error saving theme to AsyncStorage:', error);
    });
  };

  return (
    <ProductContext.Provider
      value={{
        productId,

        allProducts,
        setProductId,

        cartUpdate,
        cartItems,
        setCartItems,
        cartArray,
        setCartArray,
        drawer,
        refRBSheet,

        handleNewFavouriteValue,
        favouriteItems,
        filteredProducts,
        setFilteredProducts,
        newCollections,
        setNewCollections,
        filteredNewCollections,
        setFilteredNewCollections,
        newRating,
        toggleTheme,
        theme,
        setTheme,
        handleAddBtn,
        handleMinusBtn,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
