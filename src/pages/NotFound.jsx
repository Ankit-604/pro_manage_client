import React from "react";
import NotFoundStyles from "./stylesheets/NotFound.module.css";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={NotFoundStyles.notFound}>
      <div className={NotFoundStyles.notFoundContainer}>
        <h1 className={NotFoundStyles.notFoundTitle}>404</h1>
        <p className={NotFoundStyles.notFoundText}>Page Not Found</p>
        <button
          className={NotFoundStyles.homeButton}
          onClick={() => navigate("/login")}
        >
          HomePage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
