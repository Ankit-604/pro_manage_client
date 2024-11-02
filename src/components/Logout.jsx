import Loading from "./Loading";
import LogoutStyles from "./styles/Logout.module.css";

const Logout = ({ loading = false, handleSubmit, type, setShow }) => {
  return (
    <div className={LogoutStyles.logoutContainer}>
      <div className={LogoutStyles.logoutContent}>
        <button
          className={LogoutStyles.logoutButton}
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? <Loading /> : `Yes, ${type}`}
        </button>
        <button
          className={LogoutStyles.cancelLogout}
          onClick={() => setShow(false)}
        >
          {" "}
          Cancel
        </button>
      </div>
    </div>
  );
};
export default Logout;
