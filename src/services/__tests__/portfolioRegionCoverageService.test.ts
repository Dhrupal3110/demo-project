import { portfolioRegionCoverageService } from '../portfolioRegionCoverageService';
import { apiClient } from '../client/apiClient';
import { mockPortfolioRegionCoverageService } from '../mocks/mockPortfolioRegionCoverageService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockPortfolioRegionCoverageService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('portfolioRegionCoverageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getData calls apiClient.get', async () => {
            const mockData = {};
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await portfolioRegionCoverageService.getData();
            expect(apiClient.get).toHaveBeenCalledWith('/portfolio-region-coverage');
            expect(res).toEqual(mockData);
        });

        test('updatePortfolios calls apiClient.put', async () => {
            const items = [{ id: '1' }];
            (apiClient.put as jest.Mock).mockResolvedValue({ data: items });
            const res = await portfolioRegionCoverageService.updatePortfolios('EQ/FF', items as any);
            expect(apiClient.put).toHaveBeenCalledWith('/portfolio-region-coverage/portfolios', { peril: 'EQ/FF', portfolios: items });
            expect(res).toEqual(items);
        });

        test('updateRegions calls apiClient.put', async () => {
            const items = [{ id: '1' }];
            (apiClient.put as jest.Mock).mockResolvedValue({ data: items });
            const res = await portfolioRegionCoverageService.updateRegions('EQ/FF', items as any);
            expect(apiClient.put).toHaveBeenCalledWith('/portfolio-region-coverage/regions', { peril: 'EQ/FF', regions: items });
            expect(res).toEqual(items);
        });

        test('addSelectedCoverage calls apiClient.post', async () => {
            const items = [{ id: '1' }];
            (apiClient.post as jest.Mock).mockResolvedValue({ data: items });
            const res = await portfolioRegionCoverageService.addSelectedCoverage(items as any);
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-region-coverage/selected', { coverage: items });
            expect(res).toEqual(items);
        });

        test('removeSelectedCoverage calls apiClient.delete', async () => {
            const items = [{ id: '1' }];
            (apiClient.delete as jest.Mock).mockResolvedValue({ data: items });
            const res = await portfolioRegionCoverageService.removeSelectedCoverage('1');
            expect(apiClient.delete).toHaveBeenCalledWith('/portfolio-region-coverage/selected/1');
            expect(res).toEqual(items);
        });

        test('searchPortfolios calls apiClient.get', async () => {
            const items = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: items });
            const res = await portfolioRegionCoverageService.searchPortfolios('EQ/FF', 'q');
            expect(apiClient.get).toHaveBeenCalledWith('/portfolio-region-coverage/search', { params: { peril: 'EQ/FF', q: 'q' } });
            expect(res).toEqual(items);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await portfolioRegionCoverageService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-region-coverage/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await portfolioRegionCoverageService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-region-coverage/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getData calls mock', async () => {
            await portfolioRegionCoverageService.getData();
            expect(mockPortfolioRegionCoverageService.getData).toHaveBeenCalled();
        });

        test('updatePortfolios calls mock', async () => {
            await portfolioRegionCoverageService.updatePortfolios('EQ/FF', []);
            expect(mockPortfolioRegionCoverageService.updatePortfolios).toHaveBeenCalledWith('EQ/FF', []);
        });

        test('updateRegions calls mock', async () => {
            await portfolioRegionCoverageService.updateRegions('EQ/FF', []);
            expect(mockPortfolioRegionCoverageService.updateRegions).toHaveBeenCalledWith('EQ/FF', []);
        });

        test('addSelectedCoverage calls mock', async () => {
            await portfolioRegionCoverageService.addSelectedCoverage([]);
            expect(mockPortfolioRegionCoverageService.addSelectedCoverage).toHaveBeenCalledWith([]);
        });

        test('removeSelectedCoverage calls mock', async () => {
            await portfolioRegionCoverageService.removeSelectedCoverage('1');
            expect(mockPortfolioRegionCoverageService.removeSelectedCoverage).toHaveBeenCalledWith('1');
        });

        test('searchPortfolios calls mock', async () => {
            await portfolioRegionCoverageService.searchPortfolios('EQ/FF', 'q');
            expect(mockPortfolioRegionCoverageService.searchPortfolios).toHaveBeenCalledWith('EQ/FF', 'q');
        });

        test('saveStepData calls mockStepperService', async () => {
            await portfolioRegionCoverageService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(6, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await portfolioRegionCoverageService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(6, {});
        });
    });
});
