import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface VideoState {
    loading: boolean;
    error: string | null;
    data: any;
}

const initialState: VideoState = {
    loading: false,
    error: null,
    data: null,
};

export const uploadVideo = createAsyncThunk(
    'video/uploadVideo',
    async (
        {
            file,
            lessonId,
            sourcePlatform,
            title,
            description,
            accessToken,
            refreshToken,
        }: {
            file: File;
            lessonId: string;
            sourcePlatform: string;
            title: string;
            description: string;
            accessToken: string;
            refreshToken: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('lessonId', lessonId);
            formData.append('sourcePlatform', sourcePlatform);
            formData.append('title', title);
            formData.append('description', description);

            const response = await axios.post('http://localhost:5000/video/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchVideo = createAsyncThunk(
    'video/fetchVideo',
    async (
        {
            videoId,
      
        }: {
            videoId: string;
            accessToken: string;
            refreshToken: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(`http://localhost:5000/video/${videoId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



export const updateVideo = createAsyncThunk(
    'video/updateVideo',
    async (
        {
            videoId,
            file,
            lessonId,
            sourcePlatform,
            title,
            description,
            accessToken,
            refreshToken,
        }: {
            videoId: string;
            file: File;
            lessonId: string;
            sourcePlatform: string;
            title: string;
            description: string;
            accessToken: string;
            refreshToken: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('lessonId', lessonId);
            formData.append('sourcePlatform', sourcePlatform);
            formData.append('title', title);
            formData.append('description', description);

            const response = await axios.put(
                `http://localhost:5000/video/${videoId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default videoSlice.reducer;