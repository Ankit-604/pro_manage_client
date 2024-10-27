import React from "react";
import { Calendar as MyCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarStyles from "./styles/Calendar.module.css";
import { formatLocalDate } from "../utils";

const Calendar = ({ selectedDate, onChange }) => {
  return (
    <div className={CalendarStyles.my__calendar}>
      <MyCalendar
        onChange={onChange}
        tileClassName={({ date, view }) => {
          if (view === "month" && selectedDate) {
            return formatLocalDate(date) === formatLocalDate(selectedDate)
              ? "highlight"
              : "";
          }
          return "";
        }}
        value={selectedDate}
        minDate={new Date()}
      />
      <div className={CalendarStyles.my__calendar__buttons}>
        <button onClick={() => onChange()}>clear</button>{" "}
        <button onClick={() => onChange(new Date())}>today</button>
      </div>
    </div>
  );
};

export default Calendar;
