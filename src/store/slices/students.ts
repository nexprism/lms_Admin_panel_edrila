// studentSlice.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";
import { Student, FetchStudentsParams } from "./types";
import { createSlice } from "@reduxjs/toolkit";
// types.ts
export interface Student {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface FetchStudentsParams {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
  searchFields?: Record<string, string>;
  sort?: Record<string, "asc" | "desc">;
}

interface StudentState {
  students: Student[];
  studentDetails: Student | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const fetchAllStudents = createAsyncThunk<
  { students: Student[]; pagination: StudentState["pagination"] },
  FetchStudentsParams
>("students/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const {
      page = 1,
      limit = 10,
      filters = {},
      searchFields = {},
      sort = { createdAt: "desc" },
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));
    if (Object.keys(filters).length)
      queryParams.append("filters", JSON.stringify(filters));
    if (Object.keys(searchFields).length)
      queryParams.append("searchFields", JSON.stringify(searchFields));
    if (Object.keys(sort).length)
      queryParams.append("sort", JSON.stringify(sort));

    const response = await axiosInstance.get(
      `${API_BASE_URL}/students?${queryParams}`
    );
    const data = response.data?.data;

    return {
      students: data?.students || [],
      pagination: {
        total: data?.total || 0,
        page: data?.page || 1,
        limit: data?.limit || 10,
        totalPages: Math.ceil(data?.total / data?.limit),
      },
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchStudentById = createAsyncThunk<Student, string>(
  "students/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/students/${id}`
      );
      return response.data?.data?.student;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// studentSlice.ts

const initialState: StudentState = {
  students: [],
  studentDetails: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearStudentDetails: (state) => {
      state.studentDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllStudents
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchStudentById
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        // state.studentDetails = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStudentDetails } = studentSlice.actions;
export default studentSlice.reducer;
