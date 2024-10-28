import React, { useEffect, useRef, useState } from "react";
import { formatLocalDate, priorities } from "../utils";
import AddEditTaskStyles from "./styles/AddEditTask.module.css";
import deleteIcon from "../assets/svg/delete.svg";
import { searchUser } from "../utils/axiosRequest";
import Loading from "./Loading";
import toast from "react-hot-toast";
import UserSearchExcerpt from "./UserSearchExcerpt";
import uparrow from "../assets/svg/up-arrow.svg";
import downarrow from "../assets/svg/down-arrow.svg";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";

const AddEditTask = ({
  task = null,
  setIsShown,
  mode = "create",
  onsubmit,
}) => {
  const { loading } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState({
    title: task?.title || "",
    priority: task?.priority || "",
    assignTo: task?.assignTo || "",
    checklist: task?.checklist || [],
    dueDate: task?.dueDate || "",
  });

  const originalData = { ...task };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const lastSearchRef = useRef("");
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const [formErrors, setFormErrors] = useState({
    title: false,
    priority: false,
    checklist: false,
    checklistItems: {},
  });

  const totalChecklistItems = data.checklist.length;
  const checkedItemsCount = data.checklist.filter(
    (item) => item.checked
  ).length;

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

  const handleAssigneeSelect = (user) => {
    if (user.email !== lastSearchRef.current) {
      setData((prev) => ({ ...prev, assignTo: user._id }));
      setSearchUserResults([]);
      setSearch(user.email);
    }
  };

  const handleAddNewItem = () => {
    setData((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { itemId: generateUniqueId(), text: "", checked: false },
      ],
    }));
  };
  const handleDateChange = (date) => {
    if (date) {
      setData((prev) => ({
        ...prev,
        dueDate: formatLocalDate(date, "yyyy-MM-dd"),
      }));
      setShowDatePicker(false);
    } else {
      setData((prev) => ({ ...prev, dueDate: "" }));
    }
  };
  const handleCheckboxChange = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.itemId === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleDeleteItem = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.itemId !== id),
    }));
  };

  const handleTextChange = (id, value) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.itemId === id ? { ...item, text: value } : item
      ),
    }));
  };

  //validate fields
  const validatedata = () => {
    const newErrors = {
      title: !data.title,
      priority: !data.priority,
      checklist: totalChecklistItems === 0,
      checklistItems: {},
    };

    let showRequiredFieldToast = false;
    let showChecklistItemError = false;

    if (newErrors.title || newErrors.priority || newErrors.checklist) {
      showRequiredFieldToast = true;
    }

    if (!showRequiredFieldToast) {
      data.checklist.forEach((item) => {
        newErrors.checklistItems[item.itemId] = !item.text;
        if (!item?.text.trim()) {
          showChecklistItemError = true;
        }
      });
    }

    if (showRequiredFieldToast) {
      toast.error("* marked fields are required");
    }

    if (showChecklistItemError) {
      toast.error("Checklist items must have a title.");
    }

    setFormErrors(newErrors);
    return !(showRequiredFieldToast || showChecklistItemError);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validatedata()) {
      const submissionData =
        mode === "create"
          ? data
          : Object.keys(data).reduce((acc, key) => {
              if (data[key] !== originalData[key]) {
                acc[key] = data[key];
              }
              return acc;
            }, {});

      if (JSON.stringify(submissionData) !== "{}") {
        onsubmit(submissionData);
      } else {
        toast("⚠️ Please make some changes first!", {
          style: {
            background: "#FFFACD",
            color: "#333",
          },
        });
      }
    }
  };
  return (
    <div className={AddEditTaskStyles.addTaskContainer}>
      <div className={AddEditTaskStyles.addTaskBox}>
        <div className={AddEditTaskStyles.addTaskBoxTitle}>
          <label htmlFor="title">
            Title <span className={AddEditTaskStyles.required}>*</span>
          </label>
          <input
            className={formErrors.title ? AddEditTaskStyles.taskError : ""}
            id="title"
            type="text"
            placeholder="Enter Task Title"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className={AddEditTaskStyles.addTaskBoxPriority}>
          <label htmlFor="priority">
            Priority <span className={AddEditTaskStyles.required}>*</span>
          </label>
          <div className={AddEditTaskStyles.addTaskPriorityButtonContainer}>
            {priorities.map((priority) => (
              <button
                key={priority.value}
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    priority: priority.value,
                  }))
                }
                style={
                  priority.value === data.priority
                    ? { background: "#EEECEC" }
                    : {}
                }
                className={AddEditTaskStyles.addTaskPriorityButton}
              >
                <div
                  className={AddEditTaskStyles.addTaskPriorityColor}
                  style={{ backgroundColor: priority.color }}
                ></div>
                {priority.name}
              </button>
            ))}
          </div>
        </div>

        <div className={AddEditTaskStyles.addTaskBoxAssignee}>
          <label htmlFor="assignee">Assign to</label>
          {!!task &&
          (task?.assignTo?.includes(user._id) ||
            !task?.createdBy === user._id) ? (
            <UserSearchExcerpt user={user} />
          ) : (
            <div className={AddEditTaskStyles.addTaskBoxAssigneeContainer}>
              <div className={AddEditTaskStyles.assigneeContainerInput}>
                <input
                  type="text"
                  placeholder="Search for an assignee"
                  value={search}
                  onChange={(e) => {
                    if (e.target.value.trim() === "") {
                      setData((prev) => ({ ...prev, assignTo: "" }));
                    }
                    setSearch(e.target.value);
                  }}
                />
                {search && (
                  <button
                    title="show/hide userlist"
                    onClick={() => setShowUserList(!showUserList)}
                  >
                    <img
                      src={!showUserList ? downarrow : uparrow}
                      alt="show userlist"
                    />
                  </button>
                )}
              </div>
              {showUserList && (
                <div
                  ref={userListRef}
                  className={AddEditTaskStyles.assigneeContainer}
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
                  )}
                  {searchUserResults.length > 0 &&
                    !loadingUser &&
                    searchUserResults.map((user) => (
                      <div
                        key={user._id}
                        className={AddEditTaskStyles.assigneeSearchUser}
                      >
                        <UserSearchExcerpt user={user} />
                        <button
                          disabled={
                            task?.assignTo?.includes(user._id) ||
                            data.assignTo === user._id
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleAssigneeSelect(user);
                          }}
                        >
                          {task?.assignTo?.includes(user._id) ||
                          data.assignTo === user._id
                            ? "Assigned"
                            : "Assign"}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={AddEditTaskStyles.addTaskBoxChecklist}>
          <label htmlFor="checklist">
            Checklist{" "}
            <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
            <span className={AddEditTaskStyles.required}>*</span>
          </label>
          <div className={AddEditTaskStyles.addTaskBoxChecklistContainer}>
            <div className={AddEditTaskStyles.checklist__items}>
              {data.checklist.map((item) => (
                <div
                  className={AddEditTaskStyles.checklistItems}
                  key={item.itemId}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.itemId)}
                  />
                  <input
                    className={
                      formErrors.checklistItems[item.itemId]
                        ? AddEditTaskStyles.taskError
                        : ""
                    }
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleTextChange(item.itemId, e.target.value)
                    }
                    placeholder="Add a task"
                  />
                  <button
                    onClick={() => handleDeleteItem(item.itemId)}
                    className={AddEditTaskStyles.deleteIcon}
                  >
                    <img src={deleteIcon} alt="delete-icon" />
                  </button>
                </div>
              ))}
              <button onClick={handleAddNewItem}>+ Add New</button>
            </div>
          </div>
        </div>

        <div className={AddEditTaskStyles.addTaskBoxBottom}>
          {showDatePicker && (
            <Calendar selectedDate={data.dueDate} onChange={handleDateChange} />
          )}
          <button
            className={AddEditTaskStyles.addTaskBottomDueDate}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {data.dueDate
              ? `${formatLocalDate(data.dueDate, "MM/dd/yyyy")}`
              : "Select Due Date"}
          </button>

          <div className={AddEditTaskStyles.aaddTaskBottomButton}>
            <button
              className={AddEditTaskStyles.addTaskBottomButtonCancel}
              onClick={() => setIsShown(false)}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                handleSubmitForm(e);
              }}
              className={AddEditTaskStyles.addTaskBottomButtonSave}
            >
              {loading ? <Loading /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTask;
