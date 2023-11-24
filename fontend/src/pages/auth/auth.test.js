import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { toast } from "react-toastify";
import Login from './auth';

const mockStore = configureStore([]);

describe('<Login />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userdata: [{ username: 'testUser', address: { street: 'testStreet' } }],
      logindata: { username: 'testUser', address: { street: 'testStreet' } },
    });
    store.dispatch = jest.fn();
    fetchMock.resetMocks();
    toast.error = jest.fn()
    toast.success = jest.fn()
    const user = { username: 'testUser', email: 'testUser@test.com', phone: '123-456-7890', address: { street: 'testStreet', zipcode: '12345' } };
    localStorage.setItem('user', JSON.stringify(user));
  });

  afterEach(() => {
    localStorage.removeItem('user');
  });


  it('User should be logged off', async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  it('should set login state after successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ username: 'testUser', address: { street: 'testStreet' } }]),
      })
    );
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const accountNameInput = getByPlaceholderText('Your account name');
    const passwordInput = getByPlaceholderText('Password');
    const loginbtnsubmit = getByText('SIGN IN!');
    fireEvent.change(accountNameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testStreet' } });
    fireEvent.click(loginbtnsubmit)
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'LOGIN_DATA',
        payload: { username: 'testUser', address: { street: 'testStreet' } },
      });
    });
  });

  it('should set error state for invalid user login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    const accountNameInput = getByPlaceholderText('Your account name');
    const passwordInput = getByPlaceholderText('Password');
    const loginbtnsubmit = getByText('SIGN IN!');
    fireEvent.change(accountNameInput, { target: { value: 'erroruser' } });
    fireEvent.change(passwordInput, { target: { value: 'errorpassword' } });
    fireEvent.click(loginbtnsubmit)
    await waitFor(() => {
      expect(store.dispatch).not.toHaveBeenCalledWith({
        type: 'LOGIN_DATA',
        payload: expect.anything(),
      });
    });
  });

  it('register different password input', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('register:Your account name'), { target: { value: 'TestMan' } });
    fireEvent.change(getByPlaceholderText('Your display name(optional)'), { target: { value: 'James Bond' } });
    fireEvent.change(getByPlaceholderText('Your e-mail address'), { target: { value: 'xj3212@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Phone:123-123-1234'), { target: { value: '187-227-7457' } });
    fireEvent.change(getByPlaceholderText('Birthday:19991231'), { target: { value: '19931001' } });
    fireEvent.change(getByPlaceholderText('Valid five-digit zip code'), { target: { value: '43221' } });
    fireEvent.change(getByPlaceholderText('enter your Password'), { target: { value: 'Aa12345.' } });
    fireEvent.change(getByPlaceholderText('Password confirmation'), { target: { value: 'Aa12345.1' } });
    fireEvent.click(getByText('SIGN UP'));
    expect(toast.error).toHaveBeenCalledWith('The password confirmation must be the same as the password');
  })

  it('register neckname test false', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('register:Your account name'), { target: { value: '12341243' } });
    fireEvent.change(getByPlaceholderText('Your display name(optional)'), { target: { value: 'James Bond' } });
    fireEvent.change(getByPlaceholderText('Your e-mail address'), { target: { value: 'xj3212@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Phone:123-123-1234'), { target: { value: '187-227-7457' } });
    fireEvent.change(getByPlaceholderText('Birthday:19991231'), { target: { value: '19931001' } });
    fireEvent.change(getByPlaceholderText('Valid five-digit zip code'), { target: { value: '43221' } });
    fireEvent.change(getByPlaceholderText('enter your Password'), { target: { value: 'Aa12345.' } });
    fireEvent.change(getByPlaceholderText('Password confirmation'), { target: { value: 'Aa12345.' } });
    fireEvent.click(getByText('SIGN UP'));
    expect(toast.error).toHaveBeenCalledWith('Account name must start with letters and be combined of letters or letters and numbers');
  })

  it('register username can’t same with fetchUserList username', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('register:Your account name'), { target: { value: 'testUser' } });
    fireEvent.change(getByPlaceholderText('Your display name(optional)'), { target: { value: 'James Bond' } });
    fireEvent.change(getByPlaceholderText('Your e-mail address'), { target: { value: 'xj3212@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Phone:123-123-1234'), { target: { value: '187-227-7457' } });
    fireEvent.change(getByPlaceholderText('Birthday:19991231'), { target: { value: '19931001' } });
    fireEvent.change(getByPlaceholderText('Valid five-digit zip code'), { target: { value: '43221' } });
    fireEvent.change(getByPlaceholderText('enter your Password'), { target: { value: 'Aa12345.' } });
    fireEvent.change(getByPlaceholderText('Password confirmation'), { target: { value: 'Aa12345.' } });
    fireEvent.click(getByText('SIGN UP'));
    expect(toast.error).toHaveBeenCalledWith('same name with userjson');
  })

  it('register neckname test right', async () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Login />
        </Router>
      </Provider>
    );
    fireEvent.change(getByPlaceholderText('register:Your account name'), { target: { value: 'Aa1231' } });
    fireEvent.change(getByPlaceholderText('Your display name(optional)'), { target: { value: 'James Bond' } });
    fireEvent.change(getByPlaceholderText('Your e-mail address'), { target: { value: 'xj3212@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Phone:123-123-1234'), { target: { value: '187-217-7457' } });
    fireEvent.change(getByPlaceholderText('Birthday:19991231'), { target: { value: '19931001' } });
    fireEvent.change(getByPlaceholderText('Valid five-digit zip code'), { target: { value: '43221' } });
    fireEvent.change(getByPlaceholderText('enter your Password'), { target: { value: 'Aa12345.' } });
    fireEvent.change(getByPlaceholderText('Password confirmation'), { target: { value: 'Aa12345.' } });
    fireEvent.click(getByText('SIGN UP'));
    expect(toast.success).toHaveBeenCalledWith('two password is same');
    expect(pushSpy).toHaveBeenCalledWith('/');
  })
});
