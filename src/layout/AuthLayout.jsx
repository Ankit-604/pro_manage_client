import AuthLayoutStyles from "./AuthLayout.module.css";
import Art from "../assets/Art.png";
import { Navigate } from "react-router";
const AuthLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={AuthLayoutStyles.AuthLayout}>
      <div className={AuthLayoutStyles.side_content}>
        <span className={AuthLayoutStyles.background_circle} />
        <img src={Art} alt="logo" />
        <p>Welcome aboard my friend</p>
        <span>just a couple of clicks and we start</span>
      </div>
      <div className={AuthLayoutStyles.main_layout}>{children}</div>
    </div>
  );
};
export default AuthLayout;
