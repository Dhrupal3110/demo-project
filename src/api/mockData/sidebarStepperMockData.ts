export interface StepFormData {
  [key: number]: Record<string, any>;
}

export interface SaveResponse {
  success: boolean;
  stepId: number;
  savedAt: string;
  message?: string;
}

export interface SubmitResponse {
  success: boolean;
  submissionId: string;
  processingTime: string;
  message: string;
}

export const mockStepperData: StepFormData = {
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
};