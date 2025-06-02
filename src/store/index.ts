import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
 import courseCategoryReducer from './slices/courseCategorySlice';
// import courseReducer from './slices/courseSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    courseCategory: courseCategoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store