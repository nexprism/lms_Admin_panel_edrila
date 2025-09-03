import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface DeviceApproval {
  _id: string;
  user: { _id: string; fullName: string; email: string };
  deviceInfo: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

interface DeviceApprovalsState {
  requests: DeviceApproval[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceApprovalsState = {
  requests: [],
  loading: false,
  error: null,
};

export const fetchDeviceApprovals = createAsyncThunk(
  "deviceApprovals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/device-approvals");
      console?.log("data", response.data);
      return response.data?.data?.deviceApprovals || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDeviceApproval = createAsyncThunk(
  "deviceApprovals/updateStatus",
  async (
    { id, status, rejectionReason }: { id: string; status: "approved" | "rejected"; rejectionReason?: string },
    { rejectWithValue }
  ) => {
    try {
      const payload: any = {
        deviceApprovalId: id,
        status: status === "approved" ? "approve" : "reject",
      };
      if (status === "rejected" && rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }
      const response = await axiosInstance.post("/device-approvals/manage", payload);
      return response.data?.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const deviceApprovalsSlice = createSlice({
  name: "deviceApprovals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchDeviceApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDeviceApproval.fulfilled, (state, action) => {
        const updated = action.payload;
        state.requests = state.requests.map((req) =>
          req._id === updated._id ? updated : req
        );
      });
  },
});

export default deviceApprovalsSlice.reducer;
