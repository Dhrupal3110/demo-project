import { sidebarStepperService } from '../sidebarStepperService';
import { apiClient } from '../client/apiClient';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('sidebarStepperService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('fetchStepData calls apiClient.get', async () => {
            const mockData = { id: 1 };
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await sidebarStepperService.fetchStepData(1);
            expect(apiClient.get).toHaveBeenCalledWith('/stepper/steps/1');
            expect(res).toEqual(mockData);
        });

        test('fetchAllFormData calls apiClient.get', async () => {
            const mockData = {};
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await sidebarStepperService.fetchAllFormData();
            expect(apiClient.get).toHaveBeenCalledWith('/stepper/data');
            expect(res).toEqual(mockData);
        });

        test('saveStepData calls apiClient.post', async () => {
            const mockData = { success: true };
            (apiClient.post as jest.Mock).mockResolvedValue(mockData);
            const res = await sidebarStepperService.saveStepData(1, {});
            expect(apiClient.post).toHaveBeenCalledWith('/stepper/steps/1', {});
            expect(res).toEqual(mockData);
        });

        test('updateStepData calls apiClient.patch', async () => {
            const mockData = { success: true };
            (apiClient.patch as jest.Mock).mockResolvedValue(mockData);
            const res = await sidebarStepperService.updateStepData(1, {});
            expect(apiClient.patch).toHaveBeenCalledWith('/stepper/steps/1', {});
            expect(res).toEqual(mockData);
        });

        test('submitAllData calls apiClient.post', async () => {
            const mockData = { success: true };
            (apiClient.post as jest.Mock).mockResolvedValue(mockData);
            const res = await sidebarStepperService.submitAllData({} as any);
            expect(apiClient.post).toHaveBeenCalledWith('/stepper/submit', {});
            expect(res).toEqual(mockData);
        });

        test('validateStep calls apiClient.post', async () => {
            const mockData = { valid: true };
            (apiClient.post as jest.Mock).mockResolvedValue(mockData);
            const res = await sidebarStepperService.validateStep(1, {});
            expect(apiClient.post).toHaveBeenCalledWith('/stepper/steps/1/validate', {});
            expect(res).toEqual(mockData);
        });

        test('resetFormData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({});
            await sidebarStepperService.resetFormData();
            expect(apiClient.post).toHaveBeenCalledWith('/stepper/reset');
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('fetchStepData calls mock', async () => {
            await sidebarStepperService.fetchStepData(1);
            expect(mockStepperService.fetchStepData).toHaveBeenCalledWith(1);
        });

        test('fetchAllFormData calls mock', async () => {
            await sidebarStepperService.fetchAllFormData();
            expect(mockStepperService.fetchAllFormData).toHaveBeenCalled();
        });

        test('saveStepData calls mock', async () => {
            await sidebarStepperService.saveStepData(1, {});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(1, {});
        });

        test('updateStepData calls mock', async () => {
            await sidebarStepperService.updateStepData(1, {});
            expect(mockStepperService.updateStepData).toHaveBeenCalledWith(1, {});
        });

        test('submitAllData calls mock', async () => {
            await sidebarStepperService.submitAllData({} as any);
            expect(mockStepperService.submitAllData).toHaveBeenCalledWith({});
        });

        test('validateStep calls mock', async () => {
            await sidebarStepperService.validateStep(1, {});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(1, {});
        });

        test('resetFormData calls mock', async () => {
            await sidebarStepperService.resetFormData();
            expect(mockStepperService.resetFormData).toHaveBeenCalled();
        });
    });
});
