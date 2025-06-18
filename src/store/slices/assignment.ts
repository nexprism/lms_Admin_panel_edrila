import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../services/axiosConfig";

interface AssignmentState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: AssignmentState = {
  loading: false,
  error: null,
  data: null,
};

export const createAssignment = createAsyncThunk(
  "assignment/createAssignment",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();

      return response.data;
    } catch (err: any) {
      console.log("Error creating assignment:", err?.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAssignments = createAsyncThunk(
  "assignment/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/assignment", {
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });
      window.location.reload();

      return response.data;
    } catch (err: any) {
      console.log("Error fetching assignments:", err?.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "assignment/updateAssignment",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/assignment/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();

      return response.data;
    } catch (err: any) {
      console.log("Error updating assignment:", err?.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAssignmentById = createAsyncThunk(
  "assignment/fetchAssignmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/assignment/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err: any) {
      console.log("Error fetching assignment by id:", err?.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default assignmentSlice.reducer;
