import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardStyles from "./stylesheets/Dashboard.module.css";
import { formatLocalDate } from "../utils";

import people from "../assets/svg/people.svg";

import {
  backToDefault,
  createTask,
  deleteTask,
  setTaskRange,
  updateTask,
} from "../features/task/taskSlice";
import AddEditTask from "./../components/AddEditTask";
import toast from "react-hot-toast";
import Delete from "../components/Logout";
import AddPeople from "../components/AddPeople";
import TaskSection from "../components/TaskSec";
import Loading from "../components/Loading";

const Dashboard = () => {
  const { user, loading: loadingUser } = useSelector((state) => state.user);
  const { taskRange, error, success, loading } = useSelector(
    (state) => state.task
  );

  const [showAddPeople, setShowAddPeople] = useState(false);
  const [isAddEditTaskShown, setIsAddEditTaskShown] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [task, setTask] = useState({});
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();

  const onCreateEditTaskSubmit = async (data) => {
    if (mode === "create") {
      await dispatch(createTask(data));
    } else {
      await dispatch(updateTask({ taskId: task._id, formData: { ...data } }));
    }
  };

  useEffect(() => {
    if (!loading) {
      if (success) {
        toast.success(success);
        setIsAddEditTaskShown(false);
        setTask({});
        setShowDeleteTask(false);
      }
      if (error) toast.error(error);
      dispatch(backToDefault());
    }
  }, [loading, success, error]);

  const handleOptionChange = (e) => {
    e.preventDefault();
    dispatch(setTaskRange(e.target.value));
  };

  const cancelTaskEdit = () => {
    setTask({});
    setMode("create");
    setIsAddEditTaskShown(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  return (
    <div className={DashboardStyles.dashboardContainer}>
      <div className={DashboardStyles.dashboardHeader}>
        <div className={DashboardStyles.dashboardHeaderTop}>
          <span className={DashboardStyles.dashboardHeaderTopName}>
            Welcome!{" "}
            <span className={DashboardStyles.dashboardLoading}>
              {loadingUser ? <Loading /> : user?.name}
            </span>
          </span>{" "}
          <span className={DashboardStyles.dashboardHeaderDate}>
            {formatLocalDate()}
          </span>
        </div>
        <div className={DashboardStyles.dashboardHeaderBottom}>
          <div className={DashboardStyles.dashboardHeaderBottomLeft}>
            <span>Board</span>
            <button onClick={() => setShowAddPeople(true)}>
              <img src={people} alt="people" />
              <span style={{ marginLeft: "8px" }}>Add People</span>
            </button>
          </div>
          <div className={DashboardStyles.dashboardHeaderBottomRight}>
            <select onChange={handleOptionChange} value={taskRange}>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className={DashboardStyles.dashboardMain}>
        <TaskSection
          setIsAddEditTaskShown={setIsAddEditTaskShown}
          setMode={setMode}
          setTask={setTask}
          setShowDeleteTask={setShowDeleteTask}
        />
      </div>
      {isAddEditTaskShown && (
        <AddEditTask
          mode={mode}
          onsubmit={onCreateEditTaskSubmit}
          setIsShown={cancelTaskEdit}
          task={task}
        />
      )}

      {showDeleteTask && (
        <Delete
          loading={loading}
          handleSubmit={handleDelete}
          type="Delete"
          setShow={setShowDeleteTask}
        />
      )}

      {showAddPeople && (
        <AddPeople setShow={setShowAddPeople} userId={user?._id} />
      )}
    </div>
  );
};
export default Dashboard;
