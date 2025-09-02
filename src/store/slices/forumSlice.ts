import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface ForumReply {
  _id: string;
  content: string;
  createdBy: { _id: string; fullName: string };
  createdAt: string;
}

export interface ForumThread {
  isApproved(isApproved: any): import("react").ReactNode;
  _id: string;
  title: string;
  content: string;
  createdBy: { _id: string; fullName: string };
  createdAt: string;
  replies: ForumReply[];
  Is_openSource?: boolean; // Added property
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ForumState {
  threads: ForumThread[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  statusFilter: string;
}

const initialState: ForumState = {
  threads: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  statusFilter: "",
};

export const fetchForumThreads = createAsyncThunk(
  "forum/fetchThreads",
  async (
    { page = 1, limit = 10, token }: { page?: number; limit?: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/forum/all-threads-with-replies?isApproved=all&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched forum threads:", response.data);
      // Response shape: { data: { threads: [...], page, limit, total, totalPages } }
      return response.data?.data || {};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateForumThreadStatus = createAsyncThunk(
    "forum/approveThread",
    async (
        { threadId, token, status }: { threadId: string; token: string; status: "approved" | "rejected" },
        { rejectWithValue }
    ) => {
        try {
            // Correctly set isApproved based on status selection
            const isApproved = status == "approved";
            const response = await axiosInstance.patch(
                `/forum/thread/${threadId}/approve`,
                { isApproved },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return { threadId, isApproved, ...response.data?.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateForumThreadOpenSource = createAsyncThunk(
  "forum/updateOpenSource",
  async (
    { threadId, token, Is_openSource }: { threadId: string; token: string; Is_openSource: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/forum/thread/${threadId}/open-source`,
        { Is_openSource },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { threadId, Is_openSource, ...response.data?.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.pagination.page = 1;
    },
    // ...add other reducers if needed...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForumThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForumThreads.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.threads = action.payload.threads || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchForumThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateForumThreadStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForumThreadStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const { threadId, isApproved } = action.payload;
        const thread = state.threads.find((t) => t._id === threadId);
        if (thread) {
          thread.isApproved = isApproved;
        }
      })
      .addCase(updateForumThreadStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateForumThreadOpenSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForumThreadOpenSource.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const { threadId, Is_openSource } = action.payload;
        const thread = state.threads.find((t) => t._id === threadId);
        if (thread) {
          thread.Is_openSource = Is_openSource;
        }
      })
      .addCase(updateForumThreadOpenSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setLimit, setStatusFilter } = forumSlice.actions;
export default forumSlice.reducer;
