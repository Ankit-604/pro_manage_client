import PropTypes from "prop-types";
import TaskBoxStyles from "./styles/TaskBox.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dots from "../assets/svg/dot.svg";
import upArrow from "../assets/svg/up-arrow.svg";
import downArrow from "../assets/svg/down-arrow.svg";
import { formatLocalDate, priorities, sections, trimName } from "../utils";
import { updateTask } from "../features/task/taskSlice";
import Loading from "./Loading";
import { toast } from "react-hot-toast";

const TaskBox = ({
  task,
  collapseAll,
  setMode,
  setTask,
  setIsAddEditTaskShown,
  setShowDeleteTask,
}) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setloading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const taskPriority = priorities.find(
    (priority) => priority.value === task.priority
  );
  const optionRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();

  const totalChecklistItems = task.checklist.length;
  const checkedItemsCount = task.checklist.filter(
    (item) => item.checked
  ).length;

  useEffect(() => {
    setShowChecklist(false);
  }, [collapseAll]);

  const handleCheckBoxChange = async (itemId, checked) => {
    setloading(true);
    const result = await dispatch(
      updateTask({ taskId: task._id, formData: { itemId, checked } })
    );
    setloading(result.type !== "task/updateTaskChecklist/fulfilled");
  };

  const handleStatusChange = async (status) => {
    setloading(true);
    const result = await dispatch(
      updateTask({ taskId: task._id, formData: { status } })
    );
    setloading(result.type !== "task/updateTaskStatus/fulfilled");
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    setTask(task);
    setMode("edit");
    setIsAddEditTaskShown(true);
    setShowOptions(false);
  };

  const handleShare = (e) => {
    e.preventDefault();
    const link = `${window.location.origin}/taskoverview/${task._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link Copied"))
      .catch(() => toast.error("Failed to copy link to clipboard!"));
  };

  const handleDeleteTask = (e) => {
    e.preventDefault();
    setTask(task);
    setShowDeleteTask(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={TaskBoxStyles.taskBoxContainer}>
      <div className={TaskBoxStyles.taskBoxTop}>
        <div className={TaskBoxStyles.taskBoxPriority}>
          <div
            className={TaskBoxStyles.taskBoxPriorityColor}
            style={{ backgroundColor: taskPriority.color }}
          />
          {taskPriority.name}
          {task.createdBy !== user?._id && (
            <div className={TaskBoxStyles.taskBoxUserAvatar}>
              {trimName(user?.name)}
            </div>
          )}
        </div>
        <div className={TaskBoxStyles.taskBoxTopOptions} ref={optionRef}>
          <button title="options" onClick={() => setShowOptions(!showOptions)}>
            <img src={dots} alt="..." />
          </button>
          {showOptions && (
            <div className={TaskBoxStyles.taskBoxTopOptionsDropdown}>
              <button onClick={(e) => handleEditTask(e)}>Edit</button>
              <button onClick={(e) => handleShare(e)}>Share</button>
              <button
                onClick={(e) => handleDeleteTask(e)}
                className={TaskBoxStyles.deleteTaskButton}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div title={task?.title} className={TaskBoxStyles.taskBoxHeader}>
        {task?.title}
      </div>
      <div className={TaskBoxStyles.taskBox__checklist}>
        <div className={TaskBoxStyles.taskBoxChecklistHeader}>
          <label htmlFor="checklist">
            Checklist{" "}
            <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
          </label>
          <button onClick={() => setShowChecklist(!showChecklist)}>
            <img
              src={showChecklist ? upArrow : downArrow}
              alt="show-checklist"
            />
          </button>
        </div>
        {showChecklist && (
          <div className={TaskBoxStyles.taskBoxChecklistItems}>
            {task.checklist.map((item) => (
              <div
                key={`${item.itemId},${item.title}`}
                className={TaskBoxStyles.taskBoxChecklistItem}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) =>
                    handleCheckBoxChange(item.itemId, e.target.checked)
                  }
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={TaskBoxStyles.taskBoxBottom}>
        <div>
          {task.dueDate && (
            <span
              className={`${TaskBoxStyles.taskBoxBottomDate} ${
                task.status === "done"
                  ? TaskBoxStyles.taskBoxBottomDateDone
                  : formatLocalDate(task.dueDate) <
                      formatLocalDate(Date.now()) || task.priority === "high"
                  ? TaskBoxStyles.taskBoxBottomDateHigh
                  : ""
              }`}
            >
              {formatLocalDate(task.dueDate, " MMM ddth")}
            </span>
          )}
        </div>
        <div className={TaskBoxStyles.taskBoxButton}>
          {sections.map(
            (section) =>
              task.status !== section.value && (
                <button
                  key={section.value}
                  className={TaskBoxStyles.taskBoxButtonItem}
                  onClick={() => handleStatusChange(section.value)}
                >
                  {section.name}
                </button>
              )
          )}
        </div>
      </div>
      {loading && (
        <div className={TaskBoxStyles.taskBoxLoading}>
          <Loading />
        </div>
      )}
    </div>
  );
};

TaskBox.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    priority: PropTypes.string.isRequired,
    createdBy: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.string,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        itemId: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  collapseAll: PropTypes.bool,
  setMode: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setIsAddEditTaskShown: PropTypes.func.isRequired,
  setShowDeleteTask: PropTypes.func.isRequired,
};

export default TaskBox;
