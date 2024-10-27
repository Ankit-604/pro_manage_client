import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "pro-manage-server-ten.vercel.app
";
console.log(import.meta.env.VITE_BACKEND_URL);

// Async thunk to fetch tasks
export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (taskRange, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/task/`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: localStorage.getItem("token"),
        },
        params: {
          range: taskRange, // Use taskRange here
        },
      });
      return response?.data; // Return data for the fulfilled case
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      console.error("Error fetching tasks:", error); // Log the error
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

//create task
export const createTask = createAsyncThunk(
  "task/createTask",
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/task/create`,
        task,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response?.data;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      console.error("Error fetching tasks:", error);
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

//update task checklist
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ taskId, formData }, { rejectWithValue }) => {
    try {
      console.log(taskId, formData);
      const response = await axios.put(
        `${backendUrl}/api/v1/task/update/${taskId}`,
        { ...formData },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(response.data);
      if (response?.data?.success) {
        return { taskId, message: response?.data?.message, formData };
      } else {
        return rejectWithValue({
          error: true,
          message: response?.data?.message || "Update failed",
        });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

// addPeople to board
export const addPeople = createAsyncThunk(
  "task/addPeople",
  async ({ userEmail }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/task/addPeople`,
        { userEmail },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response?.data;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

// delete Task
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/v1/task/delete/${taskId}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return { message: response?.data?.message, taskId };
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  success: null,
  taskRange: "week",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskRange: (state, action) => {
      state.taskRange = action.payload;
    },
    backToDefault: (state) => {
      state.error = null;
      state.success = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    //get tasks
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        // state.success = action.payload.message;
        state.tasks = action.payload.data;
        state.error = null;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    //create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.tasks = [...state.tasks, action.payload.data];
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.message;
      });

    //update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { taskId, formData } = action.payload;
        const task = state.tasks.find((task) => task._id === taskId);

        if (task) {
          if (formData.itemId && formData.checked !== undefined) {
            const checklistItemIndex = task.checklist.findIndex(
              (item) => item.itemId === formData.itemId
            );
            if (checklistItemIndex !== -1) {
              task.checklist[checklistItemIndex].checked = formData.checked;
            }
          }

          if (formData.status) {
            task.status = formData.status;
          }

          // Initialize assignTo as an array if it’s undefined
          task.assignTo = task.assignTo || [];

          if (formData.assignTo) {
            task.assignTo = [...task.assignTo, formData.assignTo];
          }

          Object.keys(formData).forEach((key) => {
            if (!["itemId", "checked", "status", "assignTo"].includes(key)) {
              task[key] = formData[key];
            }
          });
        }

        state.success = action.payload.message;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    //add people to board
    builder
      .addCase(addPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.message;

        state.tasks = state.tasks.map((task) => {
          if (task.createdBy !== action.payload.data) {
            if (!task.assignTo.includes(action.payload.data)) {
              return {
                ...task,
                assignTo: [...task.assignTo, action.payload.data],
              };
            }
          }
          return task;
        });
      })
      .addCase(addPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    //delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.taskId
        );
        state.success = action.payload.message;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });
  },
});

export const { setTaskRange, backToDefault } = taskSlice.actions;

export default taskSlice.reducer;
