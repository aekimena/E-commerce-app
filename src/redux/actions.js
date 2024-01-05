export const ADD_TO_CART = 'ADD_TO_CART';
export const DELETE_CART_ITEM = 'DELETE_CART_ITEM';
export const INCREASE_ITEM_QUANTITY = 'INCREASE_ITEM_QUANTITY';
export const DECREASE_ITEM_QUANTITY = 'DECREASE_ITEM_QUANTITY';
export const SELECT_ITEM_SIZE = 'SELECT_ITEM_SIZE';
export const SELECT_ITEM_COLOR = 'SELECT_ITEM_COLOR';
export const DELETE_ALL_CARTITEM = 'DELETE_ALL_CARTITEM';
export const RESET_STATES = 'RESET_STATES';

export const addToCart = product => dispatch => {
  dispatch({
    type: ADD_TO_CART,
    payload: product,
  });
};

export const deleteCartItem = product => dispatch => {
  dispatch({
    type: DELETE_CART_ITEM,
    payload: product,
  });
};
export const deleteAllCartItem = () => dispatch => {
  dispatch({
    type: DELETE_ALL_CARTITEM,
  });
};

export const increaseItemQuantity = product => dispatch => {
  dispatch({
    type: INCREASE_ITEM_QUANTITY,
    payload: product,
  });
};

export const decreaseItemQuantity = product => dispatch => {
  dispatch({
    type: DECREASE_ITEM_QUANTITY,
    payload: product,
  });
};

export const selectItemSize = (product, size) => dispatch => {
  dispatch({
    type: SELECT_ITEM_SIZE,
    payload: product,
    newSize: size,
  });
};

export const selectItemColor = (product, color) => dispatch => {
  dispatch({
    type: SELECT_ITEM_COLOR,
    payload: product,
    newColor: color,
  });
};

export const resetStates = () => dispatch => {
  dispatch({
    type: RESET_STATES,
  });
};
