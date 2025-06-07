import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
    'assignment/createAssignment',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/assignment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const assignmentSlice = createSlice({
    name: 'assignment',
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
            });
    },
});

export default assignmentSlice.reducer;