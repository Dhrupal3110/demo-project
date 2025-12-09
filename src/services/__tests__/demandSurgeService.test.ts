import { demandSurgeService } from '../demandSurgeService';
import { apiClient } from '../client/apiClient';
import { mockDemandSurgeService } from '../mocks/mockDemandSurgeService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockDemandSurgeService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('demandSurgeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getDemandSurgeItems calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await demandSurgeService.getDemandSurgeItems();
            expect(apiClient.get).toHaveBeenCalledWith('/demand-surge');
            expect(res).toEqual(mockData);
        });

        test('updateDemandSurgeItem calls apiClient.patch', async () => {
            const update = { id: '1' };
            (apiClient.patch as jest.Mock).mockResolvedValue({ data: update });
            const res = await demandSurgeService.updateDemandSurgeItem('1', {});
            expect(apiClient.patch).toHaveBeenCalledWith('/demand-surge/1', {});
            expect(res).toEqual(update);
        });

        test('searchDemandSurgeItems calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await demandSurgeService.searchDemandSurgeItems('db', 'port');
            expect(apiClient.get).toHaveBeenCalledWith('/demand-surge/search', { params: { database: 'db', portfolio: 'port' } });
            expect(res).toEqual(mockData);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await demandSurgeService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/demand-surge/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await demandSurgeService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/demand-surge/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getDemandSurgeItems calls mock', async () => {
            await demandSurgeService.getDemandSurgeItems();
            expect(mockDemandSurgeService.getDemandSurgeItems).toHaveBeenCalled();
        });

        test('updateDemandSurgeItem calls mock', async () => {
            await demandSurgeService.updateDemandSurgeItem('1', {});
            expect(mockDemandSurgeService.updateDemandSurgeItem).toHaveBeenCalledWith('1', {});
        });

        test('searchDemandSurgeItems calls mock', async () => {
            await demandSurgeService.searchDemandSurgeItems('d', 'p');
            expect(mockDemandSurgeService.searchDemandSurgeItems).toHaveBeenCalledWith('d', 'p');
        });

        test('saveStepData calls mockStepperService', async () => {
            await demandSurgeService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(4, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await demandSurgeService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(4, {});
        });
    });
});
