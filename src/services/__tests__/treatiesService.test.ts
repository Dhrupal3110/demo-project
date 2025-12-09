import { treatiesService } from '../treatiesService';
import { apiClient } from '../client/apiClient';
import { mockTreatiesService } from '../mocks/mockTreatiesService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockTreatiesService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: {
        useDummyAPI: false,
    },
}));

describe('treatiesService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        const mockDBs = [{ id: '1' }];
        const mockTreaties = [{ id: 't1' }];

        test('getDatabases calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDBs });
            const res = await treatiesService.getDatabases();
            expect(apiClient.get).toHaveBeenCalledWith('/treaties/databases');
            expect(res).toEqual(mockDBs);
        });

        test('getTreatiesByDatabase calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTreaties });
            const res = await treatiesService.getTreatiesByDatabase('1');
            expect(apiClient.get).toHaveBeenCalledWith('/treaties/databases/1/treaties');
            expect(res).toEqual(mockTreaties);
        });

        test('searchTreaties calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTreaties });
            const res = await treatiesService.searchTreaties('q');
            expect(apiClient.get).toHaveBeenCalledWith('/treaties/search', { params: { q: 'q' } });
            expect(res).toEqual(mockTreaties);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            const res = await treatiesService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaties/step/save', {});
            expect(res).toBe('ok');
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            const res = await treatiesService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaties/step/validate', {});
            expect(res).toEqual({ valid: true });
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getDatabases calls mock', async () => {
            await treatiesService.getDatabases();
            expect(mockTreatiesService.getDatabases).toHaveBeenCalled();
        });

        test('getTreatiesByDatabase calls mock', async () => {
            await treatiesService.getTreatiesByDatabase('1');
            expect(mockTreatiesService.getTreatiesByDatabase).toHaveBeenCalledWith('1');
        });

        test('searchTreaties calls mock', async () => {
            await treatiesService.searchTreaties('q');
            expect(mockTreatiesService.searchTreaties).toHaveBeenCalledWith('q');
        });

        test('saveStepData calls mockStepperService', async () => {
            await treatiesService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(7, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await treatiesService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(7, {});
        });
    });
});
