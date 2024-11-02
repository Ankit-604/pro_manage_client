import React from "react";
import PropTypes from "prop-types";
import AuthLayoutStyles from "./AuthLayout.module.css";
import Art from "../assets/Art.png";
import { Navigate } from "react-router";

const AuthLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={AuthLayoutStyles.AuthLayout}>
      <div className={AuthLayoutStyles.sideContent}>
        <span className={AuthLayoutStyles.backgroundCircle} />
        <img src={Art} alt="logo" />
        <p>Welcome aboard my friend</p>
        <span>just a couple of clicks and we start</span>
      </div>
      <div className={AuthLayoutStyles.mainLayout}>{children}</div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
