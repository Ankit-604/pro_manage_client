import AnalyticsStyles from "./stylesheets/Analytics.module.css";
import { useSelector } from "react-redux";

const Analytics = () => {
  const { tasks } = useSelector((state) => state.task);
  const analytics = {
    tasks: {
      "Backlog Tasks": tasks.filter((task) => task.status === "backlog").length,
      "In-Progress Tasks": tasks.filter((task) => task.status === "in-progress")
        .length,
      "To-do Tasks": tasks.filter((task) => task.status === "to-do").length,
      "Done Tasks": tasks.filter((task) => task.status === "done").length,
    },
    priority: {
      "Low Priority": tasks.filter((task) => task.priority === "low").length,
      "Moderate Priority": tasks.filter((task) => task.priority === "moderate")
        .length,
      "High Priority": tasks.filter((task) => task.priority === "high").length,
      "Due Date Tasks": tasks.filter((task) => !task.dueDate).length,
    },
  };

  return (
    <div className={AnalyticsStyles.analyticsContainer}>
      <div className={AnalyticsStyles.analyticsContainerHeader}>Analytics</div>

      <div className={AnalyticsStyles.analyticsMain}>
        {Object.keys(analytics).map((key) => {
          return (
            <div key={key} className={AnalyticsStyles.analyticsMainSection}>
              {Object.keys(analytics[key]).map((item) => {
                return (
                  <div
                    className={AnalyticsStyles.analyticsMainItemContainer}
                    key={item}
                  >
                    <div className={AnalyticsStyles.analyticsMainItem}>
                      {" "}
                      <div className={AnalyticsStyles.analyticsMainItemColor} />
                      {item}
                    </div>
                    <span>{String(analytics[key][item]).padStart(2, "0")}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Analytics;
