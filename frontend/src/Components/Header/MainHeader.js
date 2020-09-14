import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../../Context/AppContext";
import Button from "../UiElements/FormElements/Button";

const MainHeader = () => {
  const {
    state: { token },
    actions: { logout },
  } = useContext(AppContext);

  return (
    <div className="main-header">
      <div>
        <h1 className="main-header__title">
          <Link to="/">Branded Members</Link>
        </h1>
      </div>
      {token && (
        <div>
          <Button onClick={logout}>LOGOUT</Button>
        </div>
      )}
    </div>
  );
};

export default MainHeader;
