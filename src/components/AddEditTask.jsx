import React, { useEffect, useRef, useState, useMemo } from "react";
import { formatLocalDate, priorities } from "../utils";
import AddEditTaskStyles from "./styles/AddEditTask.module.css";
import deleteIcon from "../assets/svg/delete.svg";

import Loading from "./Loading";
import toast from "react-hot-toast";
import UserSearchExcerpt from "./UserSearchExcerpt";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Searcher from "./Searcher";

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
    dueDate: task?.dueDate || null,
  });

  const originalData = useMemo(() => ({ ...task }), [task]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const [formErrors, setFormErrors] = useState({
    title: false,
    priority: false,
    checklist: false,
    checklistItems: {},
  });

  const totalChecklistItems = useMemo(
    () => data.checklist.length,
    [data.checklist]
  );
  const checkedItemsCount = useMemo(
    () => data.checklist.filter((item) => item.checked).length,
    [data.checklist]
  );

  const handleSetAssignee = (user) => {
    setData((prev) => ({ ...prev, assignTo: user._id }));
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
            name="title"
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
          <label>
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
          <label>Assign to</label>
          {!!task &&
          (task?.assignTo?.includes(user._id) ||
            !task?.createdBy === user._id) ? (
            <UserSearchExcerpt user={user} />
          ) : (
            <div className={AddEditTaskStyles.addTaskBoxAssigneeContainer}>
              <Searcher setUser={handleSetAssignee} task={task} data={data} />
            </div>
          )}
        </div>

        <div className={AddEditTaskStyles.addTaskBoxChecklist}>
          <label htmlFor="checklist-container">
            Checklist{" "}
            <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
            <span className={AddEditTaskStyles.required}>*</span>
          </label>
          <div
            id="checklist-container"
            className={AddEditTaskStyles.addTaskBoxChecklistContainer}
          >
            <div className={AddEditTaskStyles.checklist__items}>
              {Array.isArray(data.checklist) &&
                data.checklist.map((item) => (
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
                      aria-label={`Checklist item ${item.itemId}`}
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

AddEditTask.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string,
    priority: PropTypes.string,
    assignTo: PropTypes.string,
    checklist: PropTypes.arrayOf(PropTypes.string),
    dueDate: PropTypes.string,
  }),
  setIsShown: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
  onsubmit: PropTypes.func.isRequired,
};

export default AddEditTask;
