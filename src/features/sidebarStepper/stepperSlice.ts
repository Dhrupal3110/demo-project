import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SidebarFormData, SidebarValidationErrors } from './types';

interface StepperState {
    activeStep: number;
    maxVisitedStep: number;
    formData: SidebarFormData;
    errors: SidebarValidationErrors;
    isSubmitted: boolean;
    submissionId: string;
}

const initialState: StepperState = {
    activeStep: 2,
    maxVisitedStep: 2,
    formData: {},
    errors: {},
    isSubmitted: false,
    submissionId: '',
};

const stepperSlice = createSlice({
    name: 'stepper',
    initialState,
    reducers: {
        setActiveStep(state, action: PayloadAction<number>) {
            state.activeStep = action.payload;
        },
        setMaxVisitedStep(state, action: PayloadAction<number>) {
            state.maxVisitedStep = Math.max(state.maxVisitedStep, action.payload);
        },
        setStepData(state, action: PayloadAction<{ step: number; data: any }>) {
            state.formData[action.payload.step] = action.payload.data;
        },
        setAllFormData(state, action: PayloadAction<SidebarFormData>) {
            state.formData = action.payload;
        },
        setErrors(state, action: PayloadAction<SidebarValidationErrors>) {
            state.errors = action.payload;
        },
        setIsSubmitted(state, action: PayloadAction<boolean>) {
            state.isSubmitted = action.payload;
        },
        setSubmissionId(state, action: PayloadAction<string>) {
            state.submissionId = action.payload;
        },
        resetStepper() {
            return { ...initialState };
        },
    },
});

export const {
    setActiveStep,
    setMaxVisitedStep,
    setStepData,
    setAllFormData,
    setErrors,
    setIsSubmitted,
    setSubmissionId,
    resetStepper,
} = stepperSlice.actions;

export default stepperSlice.reducer;
