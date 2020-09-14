import React, { useContext, useEffect, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";

import MainHeader from "./Components/Header/MainHeader";
import LoadingSpinner from "./Components/UiElements/LoadingSpinner/LoadingSpinner";
import { AppContext } from "./Context/AppContext";
import AuthPage from "./Pages/AuthPage";
import UsersPage from "./Pages/UsersPage";

let logoutTimer;

function App() {
  const {
    state,
    actions: { autoLogin, logout },
  } = useContext(AppContext);
  const { token, tokenExpirationDate } = state;
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, logout]);

  let routes;
  routes = (
    <Switch>
      <Route exact path="/">
        <UsersPage />
      </Route>
      <Route exact path="/auth">
        <AuthPage />
      </Route>
    </Switch>
  );

  return (
    <div className="App">
      <BrowserRouter>
        <MainHeader />
        <main>{routes}</main>
      </BrowserRouter>
    </div>
  );
}

export default App;
