// studentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

// types.ts
export interface Student {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  status: string;
  isActive: boolean;
  profilePicture?: string;
  image?: string;
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
  searchQuery: string;
  filters: Record<string, any>;
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
      searchFields,
      sort = { createdAt: "desc" },
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));

    if (Object.keys(filters).length) {
      queryParams.append("filters", JSON.stringify(filters));
    }

    if (
      searchFields &&
      typeof searchFields.search === "string" &&
      searchFields.search.trim()
    ) {
      queryParams.append("search", searchFields.search.trim());
    }

    if (Object.keys(sort).length) {
      queryParams.append("sort", JSON.stringify(sort));
    }

    const response = await axiosInstance.get(
      `${API_BASE_URL}/students?${queryParams.toString()}`
    );

    const data = response.data?.data;

    return {
      students: data?.students || [],
      pagination: {
        total: data?.pagination?.total || 0,
        page: data?.pagination?.page || 1,
        limit: data?.pagination?.limit || 10,
        totalPages: data?.pagination?.totalPages || 1,
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

export const deleteStudent = createAsyncThunk<string, string>(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/students/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export interface DisableDripPayload {
  courseId: string;
  userId: string;
}

export const disableDripForUser = createAsyncThunk<
  { courseId: string; userId: string },
  DisableDripPayload
>(
  "students/disableDripForUser",
  async ({ courseId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/courses/${courseId}/disable-drip`,
        { userId }
      );
      return response.data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export interface CreateStudentPayload {
  fullName: string;
  email: string;
  password: string;
  [key: string]: any;
}

export const createStudent = createAsyncThunk<Student, CreateStudentPayload>(
  "students/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/create-user`,
        payload
      );
      return response.data?.data?.student;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export interface EnrollStudentPayload {
  userId: string;
  courseId: string;
}

export const enrollStudent = createAsyncThunk<
  any,
  EnrollStudentPayload
>(
  "students/enroll",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/enrollment/admin-enroll`,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState: StudentState = {
  students: [],
  studentDetails: null,
  loading: false,
  error: null,
  searchQuery: "",
  filters: {},
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
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1; // Reset to first page when searching
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filtering
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.filters = {};
      state.pagination.page = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
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
        state.studentDetails = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteStudent
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(
          (student) => student._id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(enrollStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollStudent.fulfilled, (state, action) => {
        state.loading = false;
        
        // Assuming the response contains the updated student data
        const updatedStudent = action.payload.student;
      })
      .addCase(enrollStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(disableDripForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disableDripForUser.fulfilled, (state, action) => {
        state.loading = false;
     })
      .addCase(disableDripForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearStudentDetails, 
  setSearchQuery, 
  setFilters, 
  resetFilters, 
  setCurrentPage 
} = studentSlice.actions;

export default studentSlice.reducer;

// Selector to get all students
export const getAllStudents = (state: { students: StudentState }) => state.students;