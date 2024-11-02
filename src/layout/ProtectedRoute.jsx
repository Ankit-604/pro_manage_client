import PropTypes from "prop-types";
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
  }, [dispatch, handleLogout]);

  useEffect(() => {
    dispatch(getTasks(taskRange));
    dispatch(backToDefault());
  }, [taskRange, dispatch]);

  return (
    <div className={ProtectedRouteModuleStyles.protectedRoute}>
      <section className={ProtectedRouteModuleStyles.sidebar}>
        <div className={ProtectedRouteModuleStyles.appLogo}>
          <img src={codesandbox} alt="logo" />
          <span className={ProtectedRouteModuleStyles.appLogo}>
            Pro Manager
          </span>
        </div>
        <div className={ProtectedRouteModuleStyles.linksContainer}>
          <div className={ProtectedRouteModuleStyles.links}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={layout} alt="layout" />
              <span style={{ marginLeft: "8px" }}>Board</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={database} alt="database" />
              <span style={{ marginLeft: "8px" }}>Analytics</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={settings} alt="settings" />
              <span style={{ marginLeft: "8px" }}>Settings</span>
            </NavLink>
          </div>
          <button
            onClick={() => {
              setShowLogout(true);
            }}
          >
            <img src={logout} alt="logout" />
            <span style={{ marginLeft: "8px" }}>Logout</span>
          </button>
        </div>
      </section>
      <section className="mainContent">{children}</section>

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

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
