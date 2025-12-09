import { portfolioService } from '../portfolioService';
import { apiClient } from '../client/apiClient';
import { mockPortfolioService } from '../mocks/mockPortfolioService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockPortfolioService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: {
        useDummyAPI: false,
    },
}));

describe('portfolioService', () => {
    const mockDBs = [{ id: '1', name: 'DB 1' }];
    const mockDB = { id: '1', name: 'DB 1' };

    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getDatabases calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDBs });
            const res = await portfolioService.getDatabases();
            expect(apiClient.get).toHaveBeenCalledWith('/portfolios/databases');
            expect(res).toEqual(mockDBs);
        });

        test('getDatabaseById calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDB });
            const res = await portfolioService.getDatabaseById('1');
            expect(apiClient.get).toHaveBeenCalledWith('/portfolios/databases/1');
            expect(res).toEqual(mockDB);
        });

        test('searchPortfolios calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockDBs });
            const res = await portfolioService.searchPortfolios('q');
            expect(apiClient.get).toHaveBeenCalledWith('/portfolios/search', { params: { q: 'q' } });
            expect(res).toEqual(mockDBs);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('success');
            const res = await portfolioService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolios/step/save', {});
            expect(res).toBe('success');
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            const res = await portfolioService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/portfolios/step/validate', {});
            expect(res).toEqual({ valid: true });
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getDatabases calls mockPortfolioService', async () => {
            await portfolioService.getDatabases();
            expect(mockPortfolioService.getDatabases).toHaveBeenCalled();
        });

        test('getDatabaseById calls mockPortfolioService', async () => {
            await portfolioService.getDatabaseById('1');
            expect(mockPortfolioService.getDatabaseById).toHaveBeenCalledWith('1');
        });

        test('searchPortfolios calls mockPortfolioService', async () => {
            await portfolioService.searchPortfolios('q');
            expect(mockPortfolioService.searchPortfolios).toHaveBeenCalledWith('q');
        });

        test('saveStepData calls mockStepperService', async () => {
            await portfolioService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(3, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await portfolioService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(3, {});
        });
    });
});
