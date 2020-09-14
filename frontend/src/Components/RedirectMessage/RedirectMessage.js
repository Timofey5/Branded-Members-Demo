import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";

const RedirectMessage = () => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (seconds === 0) return <Redirect to="/" />;

  return (
    <React.Fragment>
      <div className="redirect-message">
        <h2 className="redirect-message__text">
          <p> Thank you for signing up!</p> You will receive an email in the
          email address you used to sign up confirming that your account has
          been successfully created.{" "}
          <span> You will be redirected to users page in 5 seconds </span>
        </h2>
        <h3 className="redirect-message__seconds">{seconds}</h3>
        <div className="redirect-message__link">
          <Link to="/">Or just click here :)</Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RedirectMessage;
