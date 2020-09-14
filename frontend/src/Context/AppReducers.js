import {
  FETCH_REQUEST,
  AUTH_SUCCEEDED,
  FETCH_REQUEST_FAILED,
  CLEAR_ERROR,
  LOGOUT,
  USERS_FETCH_SUCCEEDED,
} from "./AppConstants";

export const appReducer = (state, action) => {
  if (action.type === FETCH_REQUEST)
    return {
      ...state,
      loading: true,
    };

  if (action.type === FETCH_REQUEST_FAILED)
    return {
      ...state,
      loading: false,
      error: action.payload.error,
    };

  if (action.type === AUTH_SUCCEEDED)
    return {
      ...state,
      loading: false,
      token: action.payload.token,
      email: action.payload.email,
      name: action.payload.name,
      age: action.payload.age,
      tokenExpirationDate: action.payload.tokenExpirationDate,
    };

  if (action.type === USERS_FETCH_SUCCEEDED)
    return {
      ...state,
      loading: false,
      usersData: action.payload.users,
    };

  if (action.type === CLEAR_ERROR)
    return {
      ...state,
      error: null,
    };

  if (action.type === LOGOUT)
    return {
      ...state,
      loading: false,
      token: null,
      email: null,
      name: null,
      error: null,
      age: null,
      tokenExpirationDate: null,
      usersData: null,
    };

  return state;
};
