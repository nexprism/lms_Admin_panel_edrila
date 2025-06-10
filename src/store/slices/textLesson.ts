import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface TextLessonState {
    loading: boolean;
    error: string | null;
    data: any;
}

const initialState: TextLessonState = {
    loading: false,
    error: null,
    data: null,
};

export const createTextLesson = createAsyncThunk(
    'textLesson/create',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/text-lesson', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchTextLessons = createAsyncThunk(
    'textLesson/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/text-lesson', {
    
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const textLessonSlice = createSlice({
    name: 'textLesson',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTextLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTextLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(createTextLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default textLessonSlice.reducer;