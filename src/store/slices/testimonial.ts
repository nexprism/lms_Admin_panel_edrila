import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';

interface Testimonial {
    name: string;
    role: string;
    message: string;
    rating: number;
    courseId: string;
}

interface TestimonialState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: TestimonialState = {
    loading: false,
    error: null,
    success: false,
};

export const addTestimonial = createAsyncThunk<
    void,
    { testimonial: Testimonial; token: string },
    { rejectValue: string }
>('testimonial/addTestimonial', async ({ testimonial, token }, { rejectWithValue }) => {
    try {
        await axiosInstance.post(
            '/admin/testimonials',
            testimonial,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add testimonial');
    }
});

export const fetchTestimonials = createAsyncThunk<
    Testimonial[],
    { token: string; status?: string; search?: string; courseId?: string },
    { rejectValue: string }
>('testimonial/fetchTestimonials', async ({ token, status, search, courseId }, { rejectWithValue }) => {
    try {
        const params: Record<string, string> = {};
        if (status) params.status = status;
        if (search) params.search = search;
        if (courseId) params.courseId = courseId;

        const response = await axiosInstance.get('/admin/testimonials', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });
        return response.data?.data || [];
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch testimonials');
    }
});

const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState,
    reducers: {
        resetTestimonialState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTestimonial.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addTestimonial.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(addTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add testimonial';
                state.success = false;
            })
            .addCase(fetchTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTestimonials.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch testimonials';
                state.success = false;
            });
    },
});

export const { resetTestimonialState } = testimonialSlice.actions;
export default testimonialSlice.reducer;