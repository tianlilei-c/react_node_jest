import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
const history = createMemoryHistory();
const pushSpy = jest.spyOn(history, 'push');
import {toast } from "react-toastify";

import Profile from './profile.js';
const mockStore = configureStore([]);
describe('<Profile />', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      logindata: { username: 'testUser', email: 'testUser@test.com', phone: '123-456-7890', address: { street: 'testStreet', zipcode: '12345' } },
    });
    store.dispatch = jest.fn();
    fetchMock.resetMocks();
    toast.error = jest.fn();
  });

  afterEach(() => {
    localStorage.removeItem('user');
  });

  it('Verify the username of the logged in user', () => {
    const user = { username: 'testUser', email: 'testUser@test.com', phone: '123-456-7890', address: { street: 'testStreet', zipcode: '12345' } };
    localStorage.setItem('user', JSON.stringify(user));
    fetchMock.mockResponse(JSON.stringify({}));
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </Provider>
    );
    expect(getByPlaceholderText('testUser')).toBeInTheDocument();
  });

  it('User no logined', async () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Profile />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith('/auth');
    });
    fetchMock.mockResponse(JSON.stringify({}));
  });

  it('should update store when form submitted with valid data', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Profile />
        </Router>
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('Your e-mail address'), { target: { value: 'newEmail@test.com' } });
    fireEvent.change(getByPlaceholderText('Phone:123-123-1234'), { target: { value: '987-654-3210' } });
    fireEvent.click(getByText('Update'));
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should show error toast when password does not match password confirmation', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Profile />
        </Router>
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('Password confirmation'), { target: { value: 'password1' } });
    fireEvent.click(getByText('Update'));
    expect(toast.error).toHaveBeenCalledWith('The password confirmation must be the same as the password');
  });

  it('click to Main', () => {
    const {getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Profile />
        </Router>
      </Provider>
    );
    fireEvent.click(getByText('Back To MAIN'));
    expect(pushSpy).toHaveBeenCalledWith('/');
  });
});
