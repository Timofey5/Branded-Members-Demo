import React, { createContext, useCallback } from "react";
import { appReducer } from "./AppReducers";
import { createActions } from "./CreateActions";

import { useThunkReducer } from "./useThunkReducer";

const initialState = {
  loading: false,
  token: null,
  email: null,
  name: null,
  error: null,
  age: null,
  tokenExpirationDate: null,
  usersData: [],
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useThunkReducer(appReducer, initialState);
  const actions = useCallback(createActions(dispatch), []);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};
