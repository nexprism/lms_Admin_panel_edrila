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
            const response = await axiosInstance.post('/bundle', formData, {
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
            const response = await axiosInstance.get('/bundle', {
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


export const fetchCourseBundleById = createAsyncThunk(
    'courseBundle/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/bundle/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data?.data || null;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


export const updateCourseBundle = createAsyncThunk(
    'courseBundle/update',
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/bundle/${id}`, formData, {
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
            })
            .addCase(fetchCourseBundleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseBundleById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCourseBundleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCourseBundle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourseBundle.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateCourseBundle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default courseBundleSlice.reducer;