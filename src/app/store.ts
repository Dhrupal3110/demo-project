import { configureStore } from '@reduxjs/toolkit';
import programReducer from './slices/programSlice';

export const store = configureStore({
  reducer: {
    program: programReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
