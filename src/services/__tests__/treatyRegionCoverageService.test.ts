import { treatyRegionCoverageService } from '../treatyRegionCoverageService';
import { apiClient } from '../client/apiClient';
import { mockTreatyRegionCoverageService } from '../mocks/mockTreatyRegionCoverageService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockTreatyRegionCoverageService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('treatyRegionCoverageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getTreatiesByPeril calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyRegionCoverageService.getTreatiesByPeril('EQ/FF');
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-region-coverage/treaties', { params: { peril: 'EQ/FF' } });
            expect(res).toEqual(mockData);
        });

        test('getRegionsByPeril calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyRegionCoverageService.getRegionsByPeril('EQ/FF');
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-region-coverage/regions', { params: { peril: 'EQ/FF' } });
            expect(res).toEqual(mockData);
        });

        test('getSelectedRegions calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyRegionCoverageService.getSelectedRegions();
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-region-coverage/selected');
            expect(res).toEqual(mockData);
        });

        test('addSelectedRegion calls apiClient.post', async () => {
            const item = { id: '1' };
            (apiClient.post as jest.Mock).mockResolvedValue({ data: item });
            const res = await treatyRegionCoverageService.addSelectedRegion(item as any);
            expect(apiClient.post).toHaveBeenCalledWith('/treaty-region-coverage/selected', item);
            expect(res).toEqual(item);
        });

        test('removeSelectedRegion calls apiClient.delete', async () => {
            (apiClient.delete as jest.Mock).mockResolvedValue({});
            const res = await treatyRegionCoverageService.removeSelectedRegion('1');
            expect(apiClient.delete).toHaveBeenCalledWith('/treaty-region-coverage/selected/1');
            expect(res).toBe(true);
        });

        test('searchTreaties calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await treatyRegionCoverageService.searchTreaties('q', 'EQ/FF');
            expect(apiClient.get).toHaveBeenCalledWith('/treaty-region-coverage/search', { params: { q: 'q', peril: 'EQ/FF' } });
            expect(res).toEqual(mockData);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await treatyRegionCoverageService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaty-region-coverage/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await treatyRegionCoverageService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/treaty-region-coverage/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getTreatiesByPeril calls mock', async () => {
            await treatyRegionCoverageService.getTreatiesByPeril('EQ/FF');
            expect(mockTreatyRegionCoverageService.getTreatiesByPeril).toHaveBeenCalledWith('EQ/FF');
        });

        test('getRegionsByPeril calls mock', async () => {
            await treatyRegionCoverageService.getRegionsByPeril('EQ/FF');
            expect(mockTreatyRegionCoverageService.getRegionsByPeril).toHaveBeenCalledWith('EQ/FF');
        });

        test('getSelectedRegions calls mock', async () => {
            await treatyRegionCoverageService.getSelectedRegions();
            expect(mockTreatyRegionCoverageService.getSelectedRegions).toHaveBeenCalled();
        });

        test('addSelectedRegion calls mock', async () => {
            await treatyRegionCoverageService.addSelectedRegion({} as any);
            expect(mockTreatyRegionCoverageService.addSelectedRegion).toHaveBeenCalled();
        });

        test('removeSelectedRegion calls mock', async () => {
            await treatyRegionCoverageService.removeSelectedRegion('1');
            expect(mockTreatyRegionCoverageService.removeSelectedRegion).toHaveBeenCalledWith('1');
        });

        test('searchTreaties calls mock', async () => {
            await treatyRegionCoverageService.searchTreaties('q', 'EQ/FF');
            expect(mockTreatyRegionCoverageService.searchTreaties).toHaveBeenCalledWith('q', 'EQ/FF');
        });

        test('saveStepData calls mockStepperService', async () => {
            await treatyRegionCoverageService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(9, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await treatyRegionCoverageService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(9, {});
        });
    });
});
