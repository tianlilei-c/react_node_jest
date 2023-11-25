import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const CategoriesItem = async (parameter) => {
  try {
    const response = await api.get(`/categories/${parameter}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const SearchItem = async (parameter) => {
  try {
    const response = await api.get(`/items/search/${parameter}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};



export const createItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const SIGNUP = async (itemData) => {
  try {
    const response = await api.post('/users', itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const LoginApi = async (account) => {
  try {
    const response = await api.post('/login', account);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

