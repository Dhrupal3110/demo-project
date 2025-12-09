import { reviewAnalysesService } from '../reviewAnalysesService';
import { apiClient } from '../client/apiClient';
import { mockReviewAnalysesService } from '../mocks/mockReviewAnalysesService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockReviewAnalysesService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('reviewAnalysesService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('fetchReviewAnalysesData calls apiClient.get', async () => {
            const mockData = {};
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await reviewAnalysesService.fetchReviewAnalysesData();
            expect(apiClient.get).toHaveBeenCalledWith('/review-analyses');
            expect(res).toEqual(mockData);
        });

        test('updateAnalysis calls apiClient.patch', async () => {
            const updates = { currency: 'USD' };
            (apiClient.patch as jest.Mock).mockResolvedValue({ data: updates });
            const res = await reviewAnalysesService.updateAnalysis('1', updates);
            expect(apiClient.patch).toHaveBeenCalledWith('/review-analyses/1', updates);
            expect(res).toEqual(updates);
        });

        test('updateContext calls apiClient.put', async () => {
            (apiClient.put as jest.Mock).mockResolvedValue({ data: 'ctx' });
            const res = await reviewAnalysesService.updateContext('ctx');
            expect(apiClient.put).toHaveBeenCalledWith('/review-analyses/context', { context: 'ctx' });
            expect(res).toBe('ctx');
        });

        test('toggleExpanded calls apiClient.post', async () => {
            const item = { id: '1', expanded: true };
            (apiClient.post as jest.Mock).mockResolvedValue({ data: item });
            const res = await reviewAnalysesService.toggleExpanded('1');
            expect(apiClient.post).toHaveBeenCalledWith('/review-analyses/1/toggle-expanded');
            expect(res).toEqual(item);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await reviewAnalysesService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/review-analyses/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await reviewAnalysesService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/review-analyses/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('fetchReviewAnalysesData calls mock', async () => {
            await reviewAnalysesService.fetchReviewAnalysesData();
            expect(mockReviewAnalysesService.fetchReviewAnalysesData).toHaveBeenCalled();
        });

        test('updateAnalysis calls mock', async () => {
            await reviewAnalysesService.updateAnalysis('1', {});
            expect(mockReviewAnalysesService.updateAnalysis).toHaveBeenCalledWith('1', {});
        });

        test('updateContext calls mock', async () => {
            await reviewAnalysesService.updateContext('ctx');
            expect(mockReviewAnalysesService.updateContext).toHaveBeenCalledWith('ctx');
        });

        test('toggleExpanded calls mock', async () => {
            await reviewAnalysesService.toggleExpanded('1');
            expect(mockReviewAnalysesService.toggleExpanded).toHaveBeenCalledWith('1');
        });

        test('saveStepData calls mockStepperService', async () => {
            await reviewAnalysesService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(11, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await reviewAnalysesService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(11, {});
        });
    });
});
