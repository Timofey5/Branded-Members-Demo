import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import RedirectMessage from "../Components/RedirectMessage/RedirectMessage";
import ErrorModal from "../Components/UiElements/ErrorModal/ErrorModal";

import Button from "../Components/UiElements/FormElements/Button";
import Input from "../Components/UiElements/FormElements/Input";
import LoadingSpinner from "../Components/UiElements/LoadingSpinner/LoadingSpinner";
import { AppContext } from "../Context/AppContext";
import { useForm } from "../hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../Util/Validators";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const {
    state: { token, loading, error },
    actions: { signup, login, clearError },
  } = useContext(AppContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = (e) => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          age: undefined,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          age: {
            value: "",
            isValid: false,
          },
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = (e) => {
    e.preventDefault();

    let userObj = {};
    for (let val in formState.inputs) {
      if (!formState.inputs[val]) continue;
      userObj[val] = formState.inputs[val].value;
    }
    if (isLoginMode) {
      login(userObj);
    } else {
      signup(userObj);
    }
  };

  if (token && !isLoginMode) return <RedirectMessage />;

  if (token && isLoginMode) return <Redirect to="/" />;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loading && <LoadingSpinner asOverlay />}
      <div className="authentication ">
        <h2>
          Login Required
          <hr />
        </h2>
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            type="text"
            label="E-Mail"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please Enter Valid E-Mail"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="text"
            label="Password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            errorText="Please Enter Valid Password min.6 characters"
            onInput={inputHandler}
            placeholder="Min. 6 characters"
          />
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please Enter Valid name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="age"
              type="number"
              label="Age"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please Enter Valid Age"
              onInput={inputHandler}
            />
          )}

          <Button animated disabled={!formState.isValid} type="submit">
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default AuthPage;
