import React from "react";
import NotFoundStyles from "./stylesheets/NotFound.module.css";

const NotFound = () => {
  return (
    <div className={NotFoundStyles.notFound}>
      <div className={NotFoundStyles.notFoundContainer}>
        <h1 className={NotFoundStyles.notFoundTitle}>404</h1>
        <p className={NotFoundStyles.notFoundText}>Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
