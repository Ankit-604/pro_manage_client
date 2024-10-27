import Loading from "./Loading";
import LogoutStyles from "./styles/Logout.module.css";

const Logout = ({ loading = false, handleSubmit, type, setShow }) => {
  return (
    <div className={LogoutStyles.logout__container}>
      <div className={LogoutStyles.logout__content}>
        <button
          className={LogoutStyles.logout__button}
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? <Loading /> : `Yes, ${type}`}
        </button>
        <button
          className={LogoutStyles.cancel__logout}
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
