import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../services/axiosConfig';

interface FileUploadPayload {
    language: string;
    fileType: string;
    downloadable: boolean;
    active: boolean;
    isPublic: boolean;
    file: File;
    lessonId: string;
    courseId: string;
}

interface FilesState {
    uploading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: FilesState = {
    uploading: false,
    error: null,
    success: false,
};

export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (payload: FileUploadPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('language', payload.language);
            formData.append('fileType', payload.fileType);
            formData.append('downloadable', String(payload.downloadable));
            formData.append('active', String(payload.active));
            formData.append('isPublic', String(payload.isPublic));
            formData.append('file', payload.file);
            formData.append('lessonId', payload.lessonId);
            formData.append('courseId', payload.courseId);

            console.log('Uploading file with payload:', payload);

            const response = await axiosInstance.post('http://localhost:5000/files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.log('File upload error:', error);
            return rejectWithValue(error.response?.data?.message || 'File upload failed');
        }
    }
);

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.uploading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadFile.fulfilled, (state) => {
                state.uploading = false;
                state.success = true;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export default filesSlice.reducer;