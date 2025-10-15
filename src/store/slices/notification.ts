import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosConfig';

interface NotificationState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: NotificationState = {
    loading: false,
    error: null,
    success: false,
};

export const sendNotification = createAsyncThunk<
    void,
    {
        title: string;
        description: string;
        type: string;
        image: File;
        webPushLink: string;
        token: string;
    }
>('notification/send', async (payload, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('data[type]', payload.type);
        formData.append('image', payload.image);
        formData.append('webPushLink', payload.webPushLink);

        await axiosInstance.post('/notifications/send', formData);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send notification');
    }
});

export const sendCourseNotification = createAsyncThunk<
    void,
    {
        courseId: string;
        title: string;
        description: string;
        type: string;
        image?: File;
        webPushLink: string;
        token: string;
    }
>('notification/sendToCourse', async (payload, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('data[type]', payload.type);
        if (payload.image) {
            formData.append('image', payload.image);
        }
        formData.append('webPushLink', payload.webPushLink);

        await axiosInstance.post(`/notifications/send-to-course/${payload.courseId}`, formData, {
            headers: {
                Authorization: `Bearer ${payload.token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send course notification');
    }
});

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearNotificationState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(sendNotification.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(sendNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(sendCourseNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(sendCourseNotification.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(sendCourseNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { clearNotificationState } = notificationSlice.actions;

export default notificationSlice.reducer;