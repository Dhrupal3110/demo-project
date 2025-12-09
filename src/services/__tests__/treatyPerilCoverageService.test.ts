import { treatyPerilCoverageService } from '../treatyPerilCoverageService';
import { apiClient } from '../client/apiClient';
import { mockTreatyPerilCoverageService } from '../mocks/mockTreatyPerilCoverageService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockTreatyPerilCoverageService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('treatyPerilCoverageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getTreatyPerils calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyPerilCoverageService.getTreatyPerils();
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-peril-coverage');
            expect(res).toEqual(mockData);
        });

        test('updateTreatyPeril calls apiClient.patch', async () => {
            const item = { id: '1' };
            (apiClient.patch as jest.Mock).mockResolvedValue({ data: item });
            const res = await treatyPerilCoverageService.updateTreatyPeril('1', {});
            expect(apiClient.patch).toHaveBeenCalledWith('/treaty-peril-coverage/1', {});
            expect(res).toEqual(item);
        });

        test('searchTreatyPerils calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyPerilCoverageService.searchTreatyPerils('q');
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-peril-coverage/search', { params: { q: 'q' } });
            expect(res).toEqual(mockData);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await treatyPerilCoverageService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaty-peril-coverage/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await treatyPerilCoverageService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaty-peril-coverage/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getTreatyPerils calls mock', async () => {
            await treatyPerilCoverageService.getTreatyPerils();
            expect(mockTreatyPerilCoverageService.getTreatyPerils).toHaveBeenCalled();
        });

        test('updateTreatyPeril calls mock', async () => {
            await treatyPerilCoverageService.updateTreatyPeril('1', {});
            expect(mockTreatyPerilCoverageService.updateTreatyPeril).toHaveBeenCalledWith('1', {});
        });

        test('searchTreatyPerils calls mock', async () => {
            await treatyPerilCoverageService.searchTreatyPerils('q');
            expect(mockTreatyPerilCoverageService.searchTreatyPerils).toHaveBeenCalledWith('q');
        });

        test('saveStepData calls mockStepperService', async () => {
            await treatyPerilCoverageService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(8, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await treatyPerilCoverageService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(8, {});
        });
    });
});
