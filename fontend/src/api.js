import axios from 'axios';
import { dispatch } from './store';
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        dispatch({ type: 'TOKEN_STATE', payload: false });
      } catch (error) {
        console.error('ERROR SET STORE WHEN CODE 401:', error);
      }
    }
    return Promise.reject(error);
  }
);

export const getUserProfile = async () => {
  try {
    let username = localStorage.getItem('UserName')
    if (!username) {
      dispatch({ type: 'TOKEN_STATE', payload: false });
      return
    }
    const response = await api.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const customError = new Error(error.response.data.error || "Error fetching user profile");
      customError.status = error.response.status;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const createArticle = async (articleData) => {
  try {
    const response = await api.post('/articles', articleData);
    return response.data;
  } catch (error) {
    console.error('Error creating article', error);
    throw error;
  }
};

export const getArticleList = async () => {
  try {
    const response = await api.get(`/articles`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SIGNUP = async (itemData) => {
  try {
    const response = await api.post('/register', itemData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 484) {
      const customError = new Error("The username already exists");
      customError.status = 484;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const LoginApi = async (account) => {
  try {
    const response = await api.post('/login', account);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const customError = new Error("Incorrect username or password");
      customError.status = 400;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const customError = new Error(error.response.data.error || "Error updating user profile");
      customError.status = error.response.status;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const updateHeadLine = async (userData) => {
  try {
    const response = await api.put('/headline', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const customError = new Error(error.response.data.error || "Error updating user profile");
      customError.status = error.response.status;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const addFollower = async (followerUsername) => {
  try {
    const response = await api.post('/followers', { followerUsername });
    return response.data;
  } catch (error) {

    if (error.response && error.response.status === 381) {
      const customError = new Error("User to be followed does not exist");
      customError.status = 381;
      throw customError;
    } else if (error.response && error.response.status === 400) {
      const customError = new Error("Already following this user");
      customError.status = 400;
      throw customError;
    } else {
      throw error;
    }
  }
};

export const getFollowers = async (username) => {
  try {
    const response = await api.get(`/followers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers', error);
    throw error;
  }
};

export const removeFollower = async (followerUsername) => {
  try {
    const response = await api.delete('/followers', { data: { followerUsername } });
    return response.data;
  } catch (error) {
    console.error('Error removing follower', error);
    throw error;
  }
};
