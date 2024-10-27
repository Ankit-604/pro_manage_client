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
      "Medium Priority": tasks.filter((task) => task.priority === "moderate")
        .length,
      "High Priority": tasks.filter((task) => task.priority === "high").length,
      "Due Date Tasks": tasks.filter((task) => !task.dueDate).length,
    },
  };

  return (
    <div className={AnalyticsStyles.analytics__container}>
      <div className={AnalyticsStyles.analytics__container__header}></div>

      <div className={AnalyticsStyles.analytics__main}>
        {Object.keys(analytics).map((key) => {
          return (
            <div key={key} className={AnalyticsStyles.analytics__main__section}>
              {Object.keys(analytics[key]).map((item) => {
                return (
                  <div
                    className={AnalyticsStyles.analytics__main__item__container}
                    key={item}
                  >
                    <div className={AnalyticsStyles.analytics__main__item}>
                      {" "}
                      <div
                        className={AnalyticsStyles.analytics__main__item__color}
                      />
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
