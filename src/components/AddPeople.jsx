import { useDispatch, useSelector } from "react-redux";
import AddPeopleStyles from "./styles/AddPeople.module.css";
import { useState } from "react";
import { addPeople } from "../features/task/taskSlice";

import PropTypes from "prop-types";
import toast from "react-hot-toast";
import Loading from "./Loading";
import Searcher from "./Searcher";

const AddPeople = ({ setShow }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { loading } = useSelector((state) => state.task);
  const [success, setSuccess] = useState(false);

  const handleAddPeople = async (user) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user || !isEmail.test(user.email)) {
      return toast.error("Please enter a valid email");
    }
    setSuccess(false);
    const result = dispatch(addPeople(user));

    if (result.type === "task/addPeople/fulfilled") {
      setSuccess(true);
    }
  };

  const handleSetUser = (user) => {
    setUser(user);
  };

  return (
    <div className={AddPeopleStyles.addPeople}>
      <div className={AddPeopleStyles.addPeopleContainer}>
        {!success ? (
          <>
            <div className={AddPeopleStyles.addPeopleContainerHeader}>
              Add people to the board
            </div>
            <div className={AddPeopleStyles.addPeopleInputContainer}>
              <Searcher setUser={handleSetUser} data={user} />
            </div>
            <div className={AddPeopleStyles.addPeopleContainerButtons}>
              <button
                onClick={() => setShow(false)}
                className={AddPeopleStyles.addPeopleContainerButtonsCancel}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleAddPeople(user)}
                className={AddPeopleStyles.addPeopleContainerButtonsAdd}
              >
                {loading ? <Loading /> : "Add Email"}
              </button>
            </div>
          </>
        ) : (
          <div className={AddPeopleStyles.addPeopleSuccess}>
            {user.email} added to Board
            <div className={AddPeopleStyles.addPeopleContainerButtons}>
              <button
                onClick={() => setShow(false)}
                className={AddPeopleStyles.addPeopleContainerButtonsAdd}
              >
                Okay, got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

AddPeople.propTypes = {
  setShow: PropTypes.func.isRequired,
};

export default AddPeople;
