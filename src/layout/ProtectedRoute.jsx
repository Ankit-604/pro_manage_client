import { NavLink } from "react-router-dom";
import ProtectedRouteModuleStyles from "./ProtectedRoute.module.css";
import codesandbox from "../assets/svg/codesandbox.svg";
import database from "../assets/svg/database.svg";
import layout from "../assets/svg/layout.svg";
import settings from "../assets/svg/settings.svg";
import logout from "../assets/svg/logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import Logout from "../components/LogoutDelete";
import { useHandleLogout } from "../utils";
import { backToDefault, getTasks } from "../features/task/taskSlice";

const ProtectedRoute = ({ children }) => {
  const { taskRange } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const handleLogout = useHandleLogout();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
    } else {
      dispatch(getUserDetails())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          handleLogout();
        });
    }
  }, []);
  useEffect(() => {
    dispatch(getTasks(taskRange));
    dispatch(backToDefault());
  }, [taskRange]);

  return (
    <div className={ProtectedRouteModuleStyles.protected_route}>
      <section className={ProtectedRouteModuleStyles.sidebar}>
        <div className={ProtectedRouteModuleStyles.app__logo}>
          <img src={codesandbox} alt="logo" />
          <span className={ProtectedRouteModuleStyles.app__logo}>
            Pro Manager
          </span>
        </div>
        <div className={ProtectedRouteModuleStyles.links__container}>
          <div className={ProtectedRouteModuleStyles.links}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={layout} alt="layout" />
              Board
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={database} alt="database" />
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={settings} alt="settings" />
              Settings
            </NavLink>
          </div>
          <button
            onClick={() => {
              setShowLogout(true);
            }}
          >
            <img src={logout} alt="logout" />
            Logout
          </button>
        </div>
      </section>
      <section className="main__content">{children}</section>

      {showLogout && (
        <Logout
          handleSubmit={handleLogout}
          type="Logout"
          setShow={setShowLogout}
        />
      )}
    </div>
  );
};

export default ProtectedRoute;
