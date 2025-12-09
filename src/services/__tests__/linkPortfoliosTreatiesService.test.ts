import { linkPortfoliosTreatiesService } from '../linkPortfoliosTreatiesService';
import { apiClient } from '../client/apiClient';
import { mockLinkService } from '../mocks/mockLinkPortfoliosTreatiesService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockLinkPortfoliosTreatiesService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('linkPortfoliosTreatiesService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('fetchLinkData calls apiClient.get', async () => {
            const mockData = { linkedItems: [] };
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await linkPortfoliosTreatiesService.fetchLinkData();
            expect(apiClient.get).toHaveBeenCalledWith('/link-portfolios-treaties');
            expect(res).toEqual(mockData);
        });

        test('addLinkedItems calls apiClient.post', async () => {
            const items = [{ id: '1' }];
            (apiClient.post as jest.Mock).mockResolvedValue({ data: items });
            const res = await linkPortfoliosTreatiesService.addLinkedItems(items as any);
            expect(apiClient.post).toHaveBeenCalledWith('/link-portfolios-treaties/items', { items });
            expect(res).toEqual(items);
        });

        test('removeLinkedItem calls apiClient.delete', async () => {
            (apiClient.delete as jest.Mock).mockResolvedValue({});
            await linkPortfoliosTreatiesService.removeLinkedItem('1');
            expect(apiClient.delete).toHaveBeenCalledWith('/link-portfolios-treaties/items/1');
        });

        test('updateLinkedItems calls apiClient.put', async () => {
            const items = [{ id: '1' }];
            (apiClient.put as jest.Mock).mockResolvedValue({ data: items });
            const res = await linkPortfoliosTreatiesService.updateLinkedItems(items as any);
            expect(apiClient.put).toHaveBeenCalledWith('/link-portfolios-treaties/items', { items });
            expect(res).toEqual(items);
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await linkPortfoliosTreatiesService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/link-portfolios-treaties/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await linkPortfoliosTreatiesService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/link-portfolios-treaties/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('fetchLinkData calls mock', async () => {
            await linkPortfoliosTreatiesService.fetchLinkData();
            expect(mockLinkService.fetchLinkData).toHaveBeenCalled();
        });

        test('addLinkedItems calls mock', async () => {
            await linkPortfoliosTreatiesService.addLinkedItems([]);
            expect(mockLinkService.addLinkedItems).toHaveBeenCalledWith([]);
        });

        test('removeLinkedItem calls mock', async () => {
            await linkPortfoliosTreatiesService.removeLinkedItem('1');
            expect(mockLinkService.removeLinkedItem).toHaveBeenCalledWith('1');
        });

        test('updateLinkedItems calls mock', async () => {
            await linkPortfoliosTreatiesService.updateLinkedItems([]);
            expect(mockLinkService.updateLinkedItems).toHaveBeenCalledWith([]);
        });

        test('saveStepData calls mockStepperService', async () => {
            await linkPortfoliosTreatiesService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(10, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await linkPortfoliosTreatiesService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(10, {});
        });
    });
});
