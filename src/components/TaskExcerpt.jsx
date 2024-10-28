import TaskExcerptStyles from "./styles/TaskExcerpt.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import dots from "../assets/svg/dot.svg";
import upArrow from "../assets/svg/up-arrow.svg";
import downArrow from "../assets/svg/down-arrow.svg";

import { formatLocalDate, priorities, sections, trimName } from "../utils";
import { updateTask } from "../features/task/taskSlice";
import Loading from "./Loading";
import { toast } from "react-hot-toast";

const TaskExcerpt = ({
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

    if (result.type === "task/updateTaskChecklist/fulfilled") {
      setloading(false);
    } else {
      setloading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setloading(true);

    const result = await dispatch(
      updateTask({ taskId: task._id, formData: { status } })
    );

    if (result.type === "task/updateTaskStatus/fulfilled") {
      setloading(false);
    } else {
      setloading(false);
    }
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
  // console.log(task);
  return (
    <div className={TaskExcerptStyles.taskExcerpt__container}>
      <div className={TaskExcerptStyles.taskExcerpt__top}>
        <div className={TaskExcerptStyles.taskExcerpt__priority}>
          <div
            className={TaskExcerptStyles.taskExcerpt__priority__color}
            style={{ backgroundColor: taskPriority.color }}
          />
          {taskPriority.name}

          {task.createdBy !== user?._id && (
            <div className={TaskExcerptStyles.taskExcerpt__user__avatar}>
              {trimName(user?.name)}
            </div>
          )}
        </div>
        <div
          className={TaskExcerptStyles.taskExcerpt__top__options}
          ref={optionRef}
        >
          <button title="options" onClick={() => setShowOptions(!showOptions)}>
            <img src={dots} alt="..." />
          </button>
          {showOptions && (
            <div
              className={TaskExcerptStyles.taskExcerpt__top__options__dropdown}
            >
              <button
                onClick={(e) => handleEditTask(e)}
                className={TaskExcerptStyles.edit__task__button}
              >
                Edit
              </button>
              <button
                onClick={(e) => handleShare(e)}
                className={TaskExcerptStyles.share__task__button}
              >
                Share
              </button>
              <button
                onClick={(e) => handleDeleteTask(e)}
                className={TaskExcerptStyles.delete__task__button}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        title={task?.title}
        className={TaskExcerptStyles.taskExcerpt__header}
      >
        {task?.title}
      </div>
      <div className={TaskExcerptStyles.taskExcerpt__checklist}>
        <div className={TaskExcerptStyles.taskExcerpt__checklist__header}>
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
          <div className={TaskExcerptStyles.taskExcerpt__checklist__items}>
            {task.checklist.map((item) => {
              return (
                <div
                  key={`${item.itemId},${item.title}`}
                  className={TaskExcerptStyles.taskExcerpt__checklist__item}
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
              );
            })}
          </div>
        )}
      </div>
      <div className={TaskExcerptStyles.taskExcerpt__bottom}>
        <div>
          {task.dueDate && (
            <span
              className={`${TaskExcerptStyles.taskExcerpt__bottom__date} ${
                task.status === "done"
                  ? TaskExcerptStyles.taskExcerpt__bottom__date__done
                  : formatLocalDate(task.dueDate) <
                      formatLocalDate(Date.now()) || task.priority === "high"
                  ? TaskExcerptStyles.taskExcerpt__bottom__date__high
                  : ""
              }`}
            >
              {formatLocalDate(task.dueDate, " MMM dd")}
            </span>
          )}
        </div>
        <div className={TaskExcerptStyles.taskExcerpt__button}>
          {sections.map(
            (section) =>
              task.status !== section.value && (
                <button
                  key={section.value}
                  className={TaskExcerptStyles.taskExcerpt__button__item}
                  onClick={() => handleStatusChange(section.value)}
                >
                  {section.name}
                </button>
              )
          )}
        </div>
      </div>
      {loading && (
        <div className={TaskExcerptStyles.taskExcerpt__loading}>
          <Loading />
        </div>
      )}
    </div>
  );
};
export default TaskExcerpt;
