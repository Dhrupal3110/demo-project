import { configureStore } from '@reduxjs/toolkit';

import { programReducer } from '@/features/selectProgram';
import stepperReducer from '@/features/sidebarStepper/stepperSlice';

export const store = configureStore({
  reducer: {
    program: programReducer,
    stepper: stepperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
