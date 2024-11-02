import React, { useState } from "react";
import PropTypes from "prop-types";
import { sections } from "../utils";
import TaskSec from "./styles/TaskSec.module.css";
import collapse from "../assets/svg/collapse-all.svg";
import addTask from "../assets/svg/addTask.svg";
import { useSelector } from "react-redux";
import TaskExcerpt from "./TaskExcerpt";
import CardLoader from "./CardLoader";

const TaskSection = ({
  setIsAddEditTaskShown,
  setMode,
  setTask,
  setShowDeleteTask,
}) => {
  const { loading, tasks } = useSelector((state) => state.task);
  const [collapseAll, setCollapseAll] = useState({
    backlog: false,
    "in-progress": false,
    "to-do": false,
    done: false,
  });

  const handleCollapseAll = (section) => {
    setCollapseAll((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sortedTasks =
    tasks && [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      {sections.map((section) => (
        <div className={TaskSec.section} key={section.name}>
          <div className={TaskSec.sectionHeader}>
            <p>{section.name}</p>
            {""}
            <div className={TaskSec.sectionHeaderButtons}>
              {section.value === "to-do" && (
                <button
                  title="add task"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddEditTaskShown(true);
                  }}
                >
                  <img src={addTask} alt="add-task" />
                </button>
              )}
              <button
                title="Collapse all"
                onClick={() => handleCollapseAll(section.value)}
              >
                <img src={collapse} alt="collapse" />
              </button>
            </div>
          </div>
          <div className={TaskSec.taskContainer}>
            {tasks?.length === 0 && loading && <CardLoader />}
            {sortedTasks &&
              sortedTasks.length > 0 &&
              sortedTasks
                .filter((task) => task.status === section.value)
                .map((task) => {
                  return (
                    <TaskExcerpt
                      key={task._id}
                      task={task}
                      setMode={setMode}
                      setTask={setTask}
                      setIsAddEditTaskShown={setIsAddEditTaskShown}
                      collapseAll={collapseAll[section.value]}
                      setShowDeleteTask={setShowDeleteTask}
                    />
                  );
                })}
          </div>
        </div>
      ))}
    </>
  );
};

TaskSection.propTypes = {
  setIsAddEditTaskShown: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  setTask: PropTypes.func.isRequired,
  setShowDeleteTask: PropTypes.func.isRequired,
};

export default TaskSection;
