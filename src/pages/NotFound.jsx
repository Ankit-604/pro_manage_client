import React from "react";
import NotFoundStyles from "./stylesheets/NotFound.module.css";

const NotFound = () => {
  return (
    <div className={NotFoundStyles.not_found}>
      <div className={NotFoundStyles.not_found__container}>
        <h1 className={NotFoundStyles.not_found__title}>404</h1>
        <p className={NotFoundStyles.not_found__text}>Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
