import codesandbox from "../assets/svg/codesandbox.svg";
import TaskOverviewStyles from "./stylesheets/TaskOverview.module.css";
import { formatLocalDate, priorities } from "./../utils/index";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { getTask } from "../utils/axiosRequest";
import Loading from "./../components/Loading";

const TaskOverview = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, data, message } = await getTask(taskId);

        if (success) {
          setTask(data);
        } else {
          toast.error(message);
          navigate("/404");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalChecklistItems = task ? task?.checklist?.length : 0;
  const checkedItemsCount = task
    ? task?.checklist?.filter((item) => item.checked)?.length
    : 0;
  const priority =
    task && priorities.find((priority) => priority.value === task.priority);

  return (
    <div className={TaskOverviewStyles.taskOverviewContainer}>
      <div className={TaskOverviewStyles.taskOverviewHeader}>
        <img src={codesandbox} alt="logo" />
        <span>Pro Manager</span>
      </div>

      <div className={TaskOverviewStyles.taskOverviewMain}>
        {loading ? (
          <Loading />
        ) : (
          <div className={TaskOverviewStyles.taskOverviewMainContainer}>
            <div
              className={TaskOverviewStyles.taskOverviewMainContainerPriority}
            >
              <div
                className={TaskOverviewStyles.taskOverviewMainPriorityColor}
                style={{ backgroundColor: priority?.color }}
              />
              {priority?.name}
            </div>
            <div className={TaskOverviewStyles.taskOverviewMainHeader}>
              {task.title}
            </div>

            <div className={TaskOverviewStyles.taskOverviewMainChecklist}>
              <div
                className={TaskOverviewStyles.taskOverviewMainChecklistHeader}
              >
                <label>
                  Checklist{" "}
                  <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
                </label>
              </div>

              <div
                className={TaskOverviewStyles.taskOverviewMainChecklistItems}
              >
                <div className={TaskOverviewStyles.taskOverviewChecklistItems}>
                  {task?.checklist?.map((item) => {
                    return (
                      <div
                        key={`${item.itemId},${item.title}`}
                        className={TaskOverviewStyles.taskOverviewChecklistItem}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => {
                            e.preventDefault();
                          }}
                        />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {task?.dueDate && (
              <div className={TaskOverviewStyles.taskOverviewMainDueDate}>
                Due Date:{""}
                <span>{formatLocalDate(task?.dueDate, " MMM ddth")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskOverview;
