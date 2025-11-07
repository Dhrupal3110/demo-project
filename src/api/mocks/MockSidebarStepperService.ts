import { mockStepperData, type StepFormData, type SaveResponse, type SubmitResponse } from '../mockData/sidebarStepperMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockSidebarStepperService {
  private formData: StepFormData = JSON.parse(JSON.stringify(mockStepperData));

  async fetchStepData(stepId: number): Promise<Record<string, any>> {
    await delay(300);
    return this.formData[stepId] || {};
  }

  async fetchAllFormData(): Promise<StepFormData> {
    await delay(500);
    return JSON.parse(JSON.stringify(this.formData));
  }

  async saveStepData(stepId: number, data: Record<string, any>): Promise<SaveResponse> {
    await delay(500);
    this.formData[stepId] = {
      ...data,
      savedAt: new Date().toISOString(),
    };
    return {
      success: true,
      stepId,
      savedAt: new Date().toISOString(),
      message: `Step ${stepId} saved successfully`,
    };
  }

  async updateStepData(stepId: number, updates: Partial<Record<string, any>>): Promise<SaveResponse> {
    await delay(300);
    this.formData[stepId] = {
      ...this.formData[stepId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      stepId,
      savedAt: new Date().toISOString(),
      message: `Step ${stepId} updated successfully`,
    };
  }

  async submitAllData(formData: StepFormData): Promise<SubmitResponse> {
    await delay(1000);
    
    // Validate required steps
    const requiredSteps = [2, 3, 7, 10, 11];
    for (const step of requiredSteps) {
      if (!formData[step]) {
        return {
          success: false,
          submissionId: '',
          processingTime: '',
          message: `Step ${step} is incomplete`,
        };
      }
    }

    const submissionId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return {
      success: true,
      submissionId,
      processingTime: '2-5 minutes',
      message: 'Configuration submitted successfully',
    };
  }

  async validateStep(stepId: number, data: Record<string, any>): Promise<{ valid: boolean; errors: Record<string, string> }> {
    await delay(200);
    const errors: Record<string, string> = {};

    // Add validation logic per step
    switch (stepId) {
      case 2:
        if (!data.selectedDatabase) {
          errors.database = 'Database is required';
        }
        break;
      case 3:
        if (!data.portfolios || data.portfolios.length === 0) {
          errors.portfolios = 'At least one portfolio is required';
        }
        break;
      case 7:
        // Treaties are optional
        break;
      case 10:
        if (!data.linkedItems || data.linkedItems.length === 0) {
          errors.linkedItems = 'At least one link is required';
        }
        break;
      case 11:
        if (!data.analyses || data.analyses.length === 0) {
          errors.reviewAnalyses = 'Analysis review is required';
        }
        break;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async resetFormData(): Promise<void> {
    await delay(200);
    this.formData = JSON.parse(JSON.stringify(mockStepperData));
  }
}

export const mockStepperService = new MockSidebarStepperService();