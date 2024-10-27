import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  "https://pro-manage-server-0yf7.onrender.com";

const initialState = {
  user: null,
  loading: false,
  success: null,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      // Creating URLSearchParams object for formData
      const params = new URLSearchParams();
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          params.append(key, formData[key]); // Updating params with formData
        }
      }

      const response = await axios.post(
        `${backendUrl}/api/v1/user/register`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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

export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/user/`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: localStorage.getItem("token"),
        },
      });
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

export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/user/updateuser`,
        formData,
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
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {},
    resetError(state) {
      state.error = null;
      state.success = null;
    },
    logoutUser(state) {
      localStorage.removeItem("token");
      state.user = null;
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    //login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    //get user details
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
        state.user = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });
    // update user details
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });
  },
});

export const { addUser, resetError, logoutUser } = userSlice.actions;
export default userSlice.reducer;
