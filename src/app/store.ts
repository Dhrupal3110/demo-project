import { configureStore } from '@reduxjs/toolkit';

import { searchProgramReducer } from '@/features/searchProgram';

export const store = configureStore({
  reducer: {
    program: searchProgramReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
