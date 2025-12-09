import { portfolioPerilCoverageService } from '../portfolioPerilCoverageService';
import { apiClient } from '../client/apiClient';
import { mockPortfolioPerilCoverageService } from '../mocks/mockPortfolioPerilCoverageService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockPortfolioPerilCoverageService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('portfolioPerilCoverageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getPortfolioPerils calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await portfolioPerilCoverageService.getPortfolioPerils();
            expect(apiClient.get).toHaveBeenCalledWith('/portfolio-peril-coverage');
            expect(res).toEqual(mockData);
        });

        test('updatePortfolioPeril calls apiClient.patch', async () => {
            const update = { id: '1' };
            (apiClient.patch as jest.Mock).mockResolvedValue({ data: update });
            const res = await portfolioPerilCoverageService.updatePortfolioPeril('1', {});
            expect(apiClient.patch).toHaveBeenCalledWith('/portfolio-peril-coverage/1', {});
            expect(res).toEqual(update);
        });

        test('searchPortfolioPerils calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await portfolioPerilCoverageService.searchPortfolioPerils('q');
            expect(apiClient.get).toHaveBeenCalledWith('/portfolio-peril-coverage/search', { params: { q: 'q' } });
            expect(res).toEqual(mockData);
        });

        test('bulkUpdatePerilCoverage calls apiClient.post', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.post as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await portfolioPerilCoverageService.bulkUpdatePerilCoverage([]);
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-peril-coverage/bulk-update', { updates: [] });
            expect(res).toEqual(mockData);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await portfolioPerilCoverageService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-peril-coverage/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await portfolioPerilCoverageService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolio-peril-coverage/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getPortfolioPerils calls mock', async () => {
            await portfolioPerilCoverageService.getPortfolioPerils();
            expect(mockPortfolioPerilCoverageService.getPortfolioPerils).toHaveBeenCalled();
        });

        test('updatePortfolioPeril calls mock', async () => {
            await portfolioPerilCoverageService.updatePortfolioPeril('1', {});
            expect(mockPortfolioPerilCoverageService.updatePortfolioPeril).toHaveBeenCalledWith('1', {});
        });

        test('searchPortfolioPerils calls mock', async () => {
            await portfolioPerilCoverageService.searchPortfolioPerils('q');
            expect(mockPortfolioPerilCoverageService.searchPortfolioPerils).toHaveBeenCalledWith('q');
        });

        test('bulkUpdatePerilCoverage calls mock', async () => {
            await portfolioPerilCoverageService.bulkUpdatePerilCoverage([]);
            expect(mockPortfolioPerilCoverageService.bulkUpdatePerilCoverage).toHaveBeenCalledWith([]);
        });

        test('saveStepData calls mockStepperService', async () => {
            await portfolioPerilCoverageService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(5, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await portfolioPerilCoverageService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(5, {});
        });
    });
});
