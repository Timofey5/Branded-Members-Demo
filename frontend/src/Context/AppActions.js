import Axios from "axios";

import {
  CLEAR_ERROR,
  FETCH_REQUEST,
  FETCH_REQUEST_FAILED,
  AUTH_SUCCEEDED,
  LOGOUT,
  USERS_FETCH_SUCCEEDED,
} from "./AppConstants";

////////////-----------FETCH_USERS--------------------/////////////////

export const fetchUsers = (token, sortOrder = "", gt = "", lt = "") => async (
  dispatch
) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const {
      data: { users },
    } = await Axios.get(
      `${process.env.REACT_APP_BACKEND_URL}?gt=${gt}&lt=${lt}&sortOrder=${sortOrder}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({ type: USERS_FETCH_SUCCEEDED, payload: { users: users } });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.response.data.message },
      });
    } else {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.message },
      });
    }
  }
};

////////////-----------SIGNUP--------------------/////////////////

export const signup = (userObj) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });

  try {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}signup`,
      userObj
    );

    const { name, email, age, token } = data;

    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

    dispatch({
      type: AUTH_SUCCEEDED,
      payload: {
        token,
        email,
        name,
        age,
        tokenExpirationDate,
      },
    });

    localStorage.setItem(
      "userData",
      JSON.stringify({
        name,
        expiration: tokenExpirationDate.toISOString(),
        token,
        email,
        age,
      })
    );
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.response.data.message },
      });
    } else {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.message },
      });
    }
  }
};

////////////-----------LOGIN--------------------/////////////////

export const login = (userObj) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });

  try {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}login`,
      userObj
    );

    const { name, email, age, token } = data;
    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    dispatch({
      type: AUTH_SUCCEEDED,
      payload: {
        token,
        email,
        name,
        age,
        tokenExpirationDate,
      },
    });
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name,
        expiration: tokenExpirationDate.toISOString(),
        token,
        email,
        age,
      })
    );
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.response.data.message },
      });
    } else {
      dispatch({
        type: FETCH_REQUEST_FAILED,
        payload: { error: err.message },
      });
    }
  }
};

////////////// -------------------AUTO_LOGIN ----------//////////////

export const autoLogin = (dispatch) => {
  const storedData = JSON.parse(localStorage.getItem("userData"));

  if (
    storedData &&
    storedData.token &&
    new Date(storedData.expiration) > new Date()
  ) {
    const { name, age, token, email, expiration } = storedData;

    dispatch({
      type: AUTH_SUCCEEDED,
      payload: {
        name,
        token,
        email,
        age,
        tokenExpirationDate: new Date(expiration),
      },
    });
  }
};

////////////-----------LOGOUT--------------------/////////////////

export const logout = (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.removeItem("userData");
};

////////////-----------CLEAR_ERROR--------------------/////////////////

export const clearError = (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};
