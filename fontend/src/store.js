import { configureStore } from '@reduxjs/toolkit';

function reducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_USERDATA':
      return { ...state, userdata: action.payload };
    case 'UPDATE_JSONDATA':
      return { ...state, jsondata: action.payload };
    case 'LOGIN_DATA':
      return { ...state, logindata: action.payload };
    default:
      return state;
  }
}

const store = configureStore({ reducer });

export default store;
