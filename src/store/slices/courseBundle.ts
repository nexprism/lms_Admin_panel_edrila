import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';

interface CourseBundleState {
    loading: boolean;
    error: string | null;
    data: any | null;
}

const initialState: CourseBundleState = {
    loading: false,
    error: null,
    data: null,
};

export const createCourseBundle = createAsyncThunk(
    'courseBundle/create',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('http://localhost:5000/bundle', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);



export const fetchCourseBundles = createAsyncThunk(
    'courseBundle/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('http://localhost:5000/bundle', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Fetched course bundles:', response?.data?.data);  
            return response.data?.data || [];
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const courseBundleSlice = createSlice({
    name: 'courseBundle',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCourseBundle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourseBundle.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(createCourseBundle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCourseBundles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseBundles.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCourseBundles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default courseBundleSlice.reducer;