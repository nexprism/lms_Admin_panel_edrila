import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
 import courseCategoryReducer from './slices/courseCategorySlice';
// import courseReducer from './slices/courseSlice';
import filter from './slices/filter';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    courseCategory: courseCategoryReducer,
    filter: filter,
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