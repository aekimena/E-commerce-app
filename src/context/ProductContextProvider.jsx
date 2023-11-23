import React, {useEffect, useState, useRef} from 'react';
import ProductContext from './ProductContext';
import {productsArray} from '../arrays/Products';
import {newCollectionsArray} from '../arrays/NewCollections';

const ProductContextProvider = ({children}) => {
  const [products, setProducts] = useState(productsArray);
  const [newCollections, setNewCollections] = useState(newCollectionsArray);
  const [cartItems, setCartItems] = useState([]);
  const [favouriteItems, setFavouritesItems] = useState([]);

  const [productId, setProductId] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const drawer = useRef(null);
  const [lightMode, setLightMode] = useState(true);

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
        newCollections,
        setNewCollections,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
