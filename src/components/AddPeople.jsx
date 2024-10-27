import { useDispatch, useSelector } from "react-redux";
import AddPeopleStyles from "./styles/AddPeople.module.css";
import { useEffect, useRef, useState } from "react";
import { addPeople } from "../features/task/taskSlice";
import uparrow from "../assets/svg/up-arrow.svg";
import downarrow from "../assets/svg/down-arrow.svg";
import { searchUser } from "../utils/axiosRequest";
import toast from "react-hot-toast";
import Loading from "./Loading";
import UserSearchExcerpt from "./UserSearchExcerpt";

const AddPeople = ({ setShow }) => {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const { loading: taskLoading } = useSelector((state) => state.task); // Renamed to avoid conflicts
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loading, setLoading] = useState(false); // Define loading state here
  const lastSearchRef = useRef("");
  const userListRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userListRef.current && !userListRef.current.contains(event.target)) {
        setShowUserList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!search) {
        setSearchUserResults([]);
        setShowUserList(false);
        return;
      }

      lastSearchRef.current = search;
      setLoadingUser(true);
      setShowUserList(true);
      try {
        const { success, data, message } = await searchUser(search);

        if (success) {
          setSearchUserResults(data);
        } else {
          toast.error(message);
        }
      } finally {
        setLoadingUser(false);
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handlePeopleSelect = (user) => {
    if (user.email !== lastSearchRef.current) {
      setUserEmail(user.email);
      setSearch(user.email);
    }
  };

  const handleAddPeople = async (userEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !emailRegex.test(userEmail)) {
      return toast.error("Please enter a valid email");
    }
    setSuccess(false);
    setLoading(true); // Add loading state
    const result = await dispatch(addPeople({ userEmail }));
    setLoading(false); // Stop loading state
    if (result.type === "task/addPeople/fulfilled") {
      setSuccess(true);
      toast.success("User added successfully");
    } else if (result.type === "task/addPeople/rejected") {
      toast.error("Failed to add user");
    }
  };

  return (
    <div className={AddPeopleStyles.add_people}>
      {/* {!loading && ( */}
      <div className={AddPeopleStyles.add_people__container}>
        {!success ? (
          <>
            <div className={AddPeopleStyles.add_people__container__header}>
              Add people to the board
            </div>
            <div className={AddPeopleStyles.add_people__input__Container}>
              <input
                value={search}
                onChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setUserEmail("");
                  }
                  setSearch(e.target.value);
                }}
                className={AddPeopleStyles.add_people__input}
                type="email"
                placeholder="Enter the email"
              />

              {search && (
                <button
                  title="show/hide userlist"
                  onClick={() => {
                    setShowUserList(!showUserList);
                  }}
                >
                  <img
                    src={!showUserList ? downarrow : uparrow}
                    alt="show userlist"
                  />
                </button>
              )}

              {showUserList && (
                <div
                  ref={userListRef}
                  className={AddPeopleStyles.add_people__list__container}
                >
                  {searchUserResults.length === 0 &&
                    !loadingUser &&
                    !!search && (
                      <p style={{ padding: "4px" }}>No user found!</p>
                    )}
                  {loadingUser && (
                    <span>
                      <Loading />
                    </span>
                  )}{" "}
                  {searchUserResults.length > 0 &&
                    !loadingUser &&
                    searchUserResults.map((user) => (
                      <div
                        key={user._id}
                        className={AddPeopleStyles.add_people__list__item}
                      >
                        {/* {console.log(
                          user.email,
                          userEmail,
                          userEmail === user.email
                        )} */}
                        <div
                          className={
                            AddPeopleStyles.add_people__list__item__avatar
                          }
                        >
                          <UserSearchExcerpt user={user} />
                        </div>

                        <div
                          className={
                            AddPeopleStyles.add_people__list__item__buttons
                          }
                        >
                          <button
                            disabled={user.email === userEmail}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePeopleSelect(user);
                            }}
                          >
                            {" "}
                            {userEmail === user.email ? "Assigned" : "Assign"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className={AddPeopleStyles.add_people__container__buttons}>
              <button
                onClick={() => setShow(false)}
                className={
                  AddPeopleStyles.add_people__container__buttons__cancel
                }
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleAddPeople(userEmail)}
                className={AddPeopleStyles.add_people__container__buttons__add}
              >
                Add Email
              </button>
            </div>
          </>
        ) : (
          <div className={AddPeopleStyles.add_people__success}>
            {userEmail} added to Board
            <div className={AddPeopleStyles.add_people__container__buttons}>
              <button
                onClick={() => setShow(false)}
                className=" add_people__container__buttons__add"
              >
                {" "}
                Okay, got it!
              </button>
            </div>
          </div>
        )}
      </div>
      {/* )} */}
    </div>
  );
};
export default AddPeople;
