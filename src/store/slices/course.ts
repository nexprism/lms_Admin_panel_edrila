import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

interface CourseState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: CourseState = {
  loading: false,
  error: null,
  data: null,
};

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // Ensure the formData is properly formatted

      console.log("Creating course with data:", formData);
      formData.append("instructerId", "684088dfef718469d2bbcb62");
      const response = await axiosInstance.post("/courses/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/courses/",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched courses:", response.data?.data?.data);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (
    { courseId, token }: { courseId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/courses/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched course by ID:", response.data?.course);
      return response.data?.data?.course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      console.log("Updating course with ID:", id, "and data:", data);
      const response = await axiosInstance.put(`/courses/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchCourseAttachments = createAsyncThunk(
  "course/fetchCourseAttachments",
  async (
    { courseId, type }: { courseId: string; type: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/courses/${courseId}/attachments`,
        {
          params: { type },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourseAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseAttachments.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming you want to store attachments in the data field
        if (state.data) {
          state.data.attachments = action.payload;
        } else {
          state.data = { attachments: action.payload };
        }
      })
      .addCase(fetchCourseAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export default courseSlice.reducer;
