import { useDispatch } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

export const useHandleLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    window.location.reload();
  };

  return handleLogout;
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatLocalDate = (
  inputDate = new Date(),
  format = "dd MMM, yyyy"
) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const monthShort = date.toLocaleString("default", { month: "short" });
  const monthFull = date.toLocaleString("default", { month: "long" });
  const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return format
    .replace("dd", day)
    .replace("MMMM", monthFull)
    .replace("MMM", monthShort)
    .replace("MM", monthNum)
    .replace("yyyy", year)
    .replace("th", getOrdinalSuffix(day));
};

export const priorities = [
  { name: "HIGH PRIORITY", color: "#FF2473", value: "high" },
  { name: "MODERATE PRIORITY", color: "#18B0FF", value: "moderate" },
  { name: "LOW PRIORITY", color: "#63C05B", value: "low" },
];

export const trimName = (name) => {
  if (!name) return false;

  const trimmed = name.trim();
  const parts = trimmed.split(" ");
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials;
};

export const sections = [
  { name: "backlog", value: "backlog" },
  { name: "to do", value: "to-do" },
  { name: "in progress", value: "in-progress" },
  { name: "done", value: "done" },
];
