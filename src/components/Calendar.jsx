import React from "react";
import { Calendar as MyCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalendarStyles from "./styles/Calendar.module.css";
import { formatLocalDate } from "../utils";

const Calendar = ({ selectedDate, onChange }) => {
  return (
    <div className={CalendarStyles.myCalendar}>
      <MyCalendar
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 15px 5px 15px",
        }}
        className={CalendarStyles.myCalendarButtons}
      >
        <button onClick={() => onChange()}>clear</button>{" "}
        <button onClick={() => onChange(new Date())}>today</button>
      </div>
    </div>
  );
};

export default Calendar;
