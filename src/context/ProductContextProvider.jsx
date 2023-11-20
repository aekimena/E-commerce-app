import React, {useEffect, useState, useRef} from 'react';
import ProductContext from './ProductContext';

const ProductContextProvider = ({children}) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Midnight blue dress',
      price: 20,
      increaseAmount: 20,
      source: require('../images/img2.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#00008b'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#00008b',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 2,
      title: 'Champagne pink dress',
      price: 40,
      increaseAmount: 40,
      source: require('../images/img3.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla non diam phasellus vestibulum lorem sed risus ultriciestristique nulla non diam phasellus vestibulum lorem sed risus ultriciestristique nulla non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#f1bf9b'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#f1bf9b',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 3,
      title: 'Burgundy Rose dress',
      price: 20,
      increaseAmount: 20,
      source: require('../images/img4.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#e75480'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#e75480',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 4,
      title: 'Hunter green dress',
      price: 10,
      increaseAmount: 10,
      source: require('../images/img5.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#006400'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'teal'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#006400',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 5,
      title: 'Goldenrod dress',
      price: 30,
      increaseAmount: 30,
      source: require('../images/img6.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#ffd700'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#ffd700',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 6,
      title: 'Red dress',
      price: 45,
      increaseAmount: 45,
      source: require('../images/img7.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: 'red'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: 'red',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 7,
      title: 'Mint green dress',
      price: 50,
      increaseAmount: 50,
      source: require('../images/img8.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#8fed8f'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'teal'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#8fed8f',
      chosenSize: 'S',
      stock: 5,
      quantity: 1,
      category: ['All', 'Women'],
    },
    {
      id: 8,
      title: 'Azure dress',
      price: 70,
      increaseAmount: 70,
      source: require('../images/img9.png'),
      favorite: false,
      addedToCart: false,
      description:
        'non diam phasellus vestibulum lorem sed risus ultriciestristique nulla',

      colors: [
        {id: 1, color: '#87ceeb'},
        {id: 2, color: 'grey'},
        {id: 3, color: 'black'},
        {id: 4, color: 'green'},
      ],
      sizes: [
        {id: 1, size: 'S'},
        {id: 2, size: 'M'},
        {id: 3, size: 'L'},
        {id: 4, size: 'XL'},
      ],
      chosenColor: '#87ceeb',
      chosenSize: 'S',
      stock: 4,
      quantity: 1,
      category: ['All', 'Women'],
    },
  ]);
  const [cartItems, setCartItems] = useState([]);
  const [favouriteItems, setFavouritesItems] = useState([]);

  const [productId, setProductId] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const drawer = useRef(null);
  const [lightMode, setLightMode] = useState(true);

  // useEffect(() => {
  //   setCartItems(products.filter(product => product.addedToCart));

  // }, [products]);

  const handleNewValue = (id, newValue, addedIem) => {
    const newCartItem = {
      id: addedIem.id,
      title: addedIem.title,
      price: addedIem.price,
      increaseAmount: addedIem.increaseAmount,
      source: addedIem.source,
      stock: addedIem.stock,
      quantity: addedIem.quantity,
      category: addedIem.category,
    };
    setProducts(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, addedToCart: newValue} : item,
      ),
    );
    setFilteredProducts(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, addedToCart: newValue} : item,
      ),
    );

    newValue
      ? setCartItems([...cartItems, newCartItem])
      : setCartItems(cartItems.filter(item => item.id !== addedIem.id));
  };

  const handleNewFavouriteValue = (id, newValue, addedIem) => {
    const newFavouriteItem = {
      id: addedIem.id,
      title: addedIem.title,
      price: addedIem.price,
      favorite: addedIem.favorite,
      source: addedIem.source,
      addedToCart: addedIem.addedToCart,
    };
    setProducts(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, favorite: newValue} : item,
      ),
    );
    setFilteredProducts(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, favorite: newValue} : item,
      ),
    );

    newValue
      ? setFavouritesItems([...favouriteItems, newFavouriteItem])
      : setFavouritesItems(
          favouriteItems.filter(item => item.id !== addedIem.id),
        );
  };
  const handleNewQuantityValue = (id, newValue) => {
    setCartItems(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, quantity: newValue} : item,
      ),
    );
  };
  const handleNewPriceValue = (id, newValue) => {
    setCartItems(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, price: newValue} : item,
      ),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        productId,
        products,
        setProductId,
        setProducts,
        handleNewValue,
        cartItems,
        setCartItems,
        drawer,
        handleNewQuantityValue,
        handleNewPriceValue,
        handleNewFavouriteValue,
        favouriteItems,
        filteredProducts,
        setFilteredProducts,
        lightMode,
        setLightMode,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
