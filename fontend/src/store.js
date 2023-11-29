import { configureStore } from '@reduxjs/toolkit';
const initialState = {
  tokenState: true, 
};
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USERDATA':
      return { ...state, userdata: action.payload };
    case 'UPDATE_JSONDATA':
      return { ...state, jsondata: action.payload };
    case 'LOGIN_DATA':
      return { ...state, logindata: action.payload };
    case 'TOKEN_STATE':
      return { ...state, tokenState: action.payload };
    default:
      return state;
  }
}

const store = configureStore({ reducer });
export const dispatch = store.dispatch;
export default store;