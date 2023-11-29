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
  const [cartIds, setCartIds] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [favouriteItems, setFavouritesItems] = useState([]);
  const [productId, setProductId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filteredNewCollections, setFilteredNewCollections] =
    useState(newCollections);
  const drawer = useRef(null);
  const refRBSheet = useRef();

  const [theme, setTheme] = useState('light');

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

  // function for adding product to cart and AsyncStorage

  const addToCartAndStorage = (product, newObj) => {
    setCartIds([...cartIds, product.id]);
    setCartArray([...cartArray, newObj]);
  };

  // function for deleting cart item from cart and AsyncStorage

  const deleteFromCartAndStorage = product => {
    setCartIds(cartIds.filter(item => item !== product.id));
    setCartArray(cartArray.filter(item => item.id !== product.id));
  };

  // function for updating cart

  const cartUpdate = (boolean, product) => {
    const newObject = {
      id: product.id,
      title: renderedCartItem(product.id).title,
      price: renderedCartItem(product.id).price,
      increaseAmount: renderedCartItem(product.id),
      imageSource: renderedCartItem(product.id).imageSource,
      stock: renderedCartItem(product.id).stock,
      quantity: 1,
    };
    boolean
      ? addToCartAndStorage(product, newObject)
      : deleteFromCartAndStorage(product);
  };

  // function for favorite items update

  const handleNewFavouriteValue = (id, boolean, originalItem) => {
    const newFavouriteItem = {
      id: originalItem.id,
      title: allProducts[allProducts.findIndex(obj => obj.id == id)].title,
      price: allProducts[allProducts.findIndex(obj => obj.id == id)].price,
      favorite: allProducts[allProducts.findIndex(obj => obj.id == id)].liked,
      source:
        allProducts[allProducts.findIndex(obj => obj.id == id)].imageSource,
      addedToCart:
        allProducts[allProducts.findIndex(obj => obj.id == id)].addedToCart,
    };
    setAllProducts(prevData =>
      prevData.map(item => (item.id === id ? {...item, liked: boolean} : item)),
    );
    boolean
      ? setFavouritesItems([...favouriteItems, newFavouriteItem])
      : setFavouritesItems(
          favouriteItems.filter(item => item.id !== originalItem.id),
        );
  };

  // function to add quantity of cart item

  const handleAddQuantityValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, quantity: (item.quantity += 1)} : item,
      ),
    );
  };

  // function to minus quantity of cart item

  const handleMinusQuantityValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, quantity: (item.quantity -= 1)} : item,
      ),
    );
  };

  // function to add price of cart item

  const handleAddPriceValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id
          ? {...item, price: (item.price += item.increaseAmount)}
          : item,
      ),
    );
  };

  // function to minus price of cart item

  const handleMinusPriceValue = id => {
    setCartArray(prevData =>
      prevData.map(item =>
        item.id === id
          ? {...item, price: (item.price -= item.increaseAmount)}
          : item,
      ),
    );
  };

  // function for add button press of cart item

  const handleAddBtn = item => {
    item.quantity < item.stock
      ? (handleAddQuantityValue(item.id), handleAddPriceValue(item.id))
      : setCartArray(prevData =>
          prevData.map(item => item.id == item.id && item),
        );
  };

  // function for minus button press of cart item

  const handleMinusBtn = item => {
    item.quantity > 1
      ? (handleMinusQuantityValue(item.id), handleMinusPriceValue(item.id))
      : setCartArray(prevData =>
          prevData.map(item => item.id == item.id && item),
        );
  };

  // update product rating

  const newRating = (id, rating) => {
    setAllProducts(prevData =>
      prevData.map(item => (item.id === id ? {...item, rating: rating} : item)),
    );
  };

  useEffect(() => {
    // load theme from AsyncStorage

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

    // load cart from AsyncStorage

    async function loadCart() {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartIds(
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

  // update cart in AsyncStorage for every change in cart

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cartIds)).catch(error => {
      console.error('Error saving cart to AsyncStorage:', error);
    });
  }, [cartIds]);

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
        cartIds,
        setCartIds,
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
