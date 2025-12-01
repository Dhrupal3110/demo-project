import { configureStore } from '@reduxjs/toolkit';

import { searchProgramReducer } from '@/features/selectProgram';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';

export const store = configureStore({
  reducer: {
    program: searchProgramReducer,
    stepper: stepperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
