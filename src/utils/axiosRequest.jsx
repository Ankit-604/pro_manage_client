import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

export const getTask = async (taskId) => {
  try {
    const response = await axios.get(`${url}/api/v1/task/getTask/${taskId}`);
    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { success: false, message: errorMessage };
  }
};

export const searchUser = async (searchQuery) => {
  try {
    const response = await axios.get(`${url}/api/v1/user/search`, {
      params: { search: searchQuery },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: localStorage.getItem("token"),
      },
    });

    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = "Network error. Please try again.";
    } else {
      errorMessage = "Error: " + error.message;
    }
    return { success: false, message: errorMessage };
  }
};
