import {
  ADD_TO_CART,
  DELETE_CART_ITEM,
  SELECT_ITEM_COLOR,
  SELECT_ITEM_SIZE,
  INCREASE_ITEM_QUANTITY,
  DECREASE_ITEM_QUANTITY,
  DELETE_ALL_CARTITEM,
  RESET_STATES,
} from './actions';
import {combineReducers} from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

function cartReducer(state = initialState, action) {
  const item = action.payload;
  switch (action.type) {
    case ADD_TO_CART:
      // this new array is created to make use of the select-down library
      const newSizesArray = item.sizes.map((sizeItem, index) => {
        return {
          key: index,
          value: sizeItem.size,
        };
      });

      // these new variables are created for cart functions
      item.price = item.discountPrice ? item.discountPrice : item.price;
      item.increaseValue = item.discountPrice ? item.discountPrice : item.price;
      item.quantity = 1;

      item.sizeArrayForDropDown = newSizesArray;

      item.selectedColor = item.colors[0].color;
      item.selectedSize = item.sizes[0].size;
      item.displayColor = item.colors.find(
        obj => obj.color === item.selectedColor,
      ).displayName;
      item.displaySize = item.sizes.find(
        obj => obj.size === item.selectedSize,
      ).displayName;

      return {...state, cart: [...state.cart, item]};
    case DELETE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.filter(cartItem => cartItem._id !== item._id),
      };
    case DELETE_ALL_CARTITEM:
      return {
        ...state,
        cart: [],
      };
    case SELECT_ITEM_COLOR:
      const index = state.cart.findIndex(obj => obj._id == item._id);
      const newArray = [...state.cart];
      newArray[index] = {
        ...newArray[index],
        selectedColor: action.newColor,
        displayColor: item.colors.find(obj => obj.color === action.newColor)
          .displayName,
      };

      return {...state, cart: newArray};
    case SELECT_ITEM_SIZE:
      const indexRefSize = state.cart.findIndex(obj => obj._id == item._id);
      const newArrayRefSize = [...state.cart];
      newArrayRefSize[indexRefSize] = {
        ...newArrayRefSize[indexRefSize],
        selectedSize: action.newSize,
        displaySize: item.sizes.find(obj => obj.size === action.newSize)
          .displayName,
      };
      return {...state, cart: newArrayRefSize};
    case INCREASE_ITEM_QUANTITY:
      const indexRefIQ = state.cart.findIndex(obj => obj._id == item._id);
      const newArrayRefIQ = [...state.cart];
      newArrayRefIQ[indexRefIQ] = {
        ...newArrayRefIQ[indexRefIQ],
        quantity: item.quantity + 1,
        price: item.price + item.increaseValue,
      };
      return {...state, cart: newArrayRefIQ};

    case DECREASE_ITEM_QUANTITY:
      const indexRefDQ = state.cart.findIndex(obj => obj._id == item._id);
      const newArrayRefDQ = [...state.cart];
      newArrayRefDQ[indexRefDQ] = {
        ...newArrayRefDQ[indexRefDQ],
        quantity: item.quantity - 1,
        price: item.price - item.increaseValue,
      };
      return {...state, cart: newArrayRefDQ};
    case RESET_STATES:
      return initialState;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  cartReducer,
});
export default rootReducer;
