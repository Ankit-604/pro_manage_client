import { useDispatch } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toLocaleString } from "react";

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

export const formatLocalDate = (
  inputDate = new Date(),
  format = "dd MMM, yyyy"
) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const fullMonth = date.toLocaleString("default", { month: "long" });
  const numMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const time = date.getTime();

  // console.log("numMonth", month);
  return format
    .replace("dd", day)
    .replace("MMMM", fullMonth)
    .replace("MMM", month)
    .replace("MM", numMonth)
    .replace("yyyy", year)
    .replace("tt", time);
};

export const priorities = [
  { name: "HIGH PRIORITY", color: "#FF2473", value: "high" },
  { name: "MODERATE PRIORITY", color: "#18B0FF", value: "moderate" },
  { name: "LOW PRIORITY", color: "#63C05B", value: "low" },
];

export const trimName = (name) => {
  if (!name) return false;

  name = name.trim();

  const words = name.split(" ");
  const firstLetters = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return firstLetters;
};

export const sections = [
  { name: "backlog", value: "backlog" },
  { name: "to do", value: "to-do" },
  { name: "in progress", value: "in-progress" },
  { name: "done", value: "done" },
];
