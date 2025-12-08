import { programService } from '../programService';
import { apiClient } from '../client/apiClient';
import { mockApiService } from '../mocks/mockApiService';
import { API_CONFIG } from '../config/apiConfig';

// Mock dependencies
jest.mock('../client/apiClient');
jest.mock('../mocks/mockApiService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: {
        useDummyAPI: false,
    },
}));

describe('programService', () => {
    const mockPrograms = [{ id: '1', name: 'Program 1' }];
    const mockProgram = { id: '1', name: 'Program 1' };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset API_CONFIG to false by default
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getAllPrograms calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.getAllPrograms();
            expect(apiClient.get).toHaveBeenCalledWith('/programs', { params: undefined });
        });

        test('searchPrograms calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.searchPrograms('query');
            expect(apiClient.get).toHaveBeenCalledWith('/programs/search', { params: { q: 'query' } });
        });

        test('getProgramById calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProgram });
            await programService.getProgramById('1');
            expect(apiClient.get).toHaveBeenCalledWith('/programs/1');
        });

        test('createProgram calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ data: mockProgram });
            await programService.createProgram({ name: 'Program 1' } as any);
            expect(apiClient.post).toHaveBeenCalledWith('/programs', { name: 'Program 1' });
        });

        test('updateProgram calls apiClient.put', async () => {
            (apiClient.put as jest.Mock).mockResolvedValue({ data: mockProgram });
            await programService.updateProgram('1', { name: 'Updated' });
            expect(apiClient.put).toHaveBeenCalledWith('/programs/1', { name: 'Updated' });
        });

        test('deleteProgram calls apiClient.delete', async () => {
            (apiClient.delete as jest.Mock).mockResolvedValue({});
            await programService.deleteProgram('1');
            expect(apiClient.delete).toHaveBeenCalledWith('/programs/1');
        });

        test('searchBySubscribeReference calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.searchBySubscribeReference('ref');
            expect(apiClient.get).toHaveBeenCalledWith('/programs/search/subscribe-reference', { params: { q: 'ref' } });
        });

        test('searchByArrowId calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.searchByArrowId('arrow');
            expect(apiClient.get).toHaveBeenCalledWith('/programs/search/arrow-id', { params: { q: 'arrow' } });
        });

        test('searchByCedantName calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.searchByCedantName('cedant');
            expect(apiClient.get).toHaveBeenCalledWith('/programs/search/cedant-name', { params: { q: 'cedant' } });
        });

        test('getRecentPrograms calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockPrograms });
            await programService.getRecentPrograms(5);
            expect(apiClient.get).toHaveBeenCalledWith('/programs/recent', { params: { limit: 5 } });
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getAllPrograms calls mockApiService.getAllPrograms', async () => {
            await programService.getAllPrograms();
            expect(mockApiService.getAllPrograms).toHaveBeenCalled();
        });

        test('searchPrograms calls mockApiService.searchPrograms', async () => {
            await programService.searchPrograms('query');
            expect(mockApiService.searchPrograms).toHaveBeenCalledWith('query');
        });

        test('getProgramById calls mockApiService.getProgramById', async () => {
            await programService.getProgramById('1');
            expect(mockApiService.getProgramById).toHaveBeenCalledWith('1');
        });

        test('createProgram calls mockApiService.createProgram', async () => {
            await programService.createProgram({ name: 'Program 1' } as any);
            expect(mockApiService.createProgram).toHaveBeenCalled();
        });

        test('updateProgram calls mockApiService.updateProgram', async () => {
            await programService.updateProgram('1', { name: 'Updated' });
            expect(mockApiService.updateProgram).toHaveBeenCalled();
        });

        test('deleteProgram calls mockApiService.deleteProgram', async () => {
            await programService.deleteProgram('1');
            expect(mockApiService.deleteProgram).toHaveBeenCalledWith('1');
        });

        test('searchBySubscribeReference calls mockApiService.searchBySubscribeReference', async () => {
            await programService.searchBySubscribeReference('ref');
            expect(mockApiService.searchBySubscribeReference).toHaveBeenCalledWith('ref');
        });

        test('searchByArrowId calls mockApiService.searchByArrowId', async () => {
            await programService.searchByArrowId('arrow');
            expect(mockApiService.searchByArrowId).toHaveBeenCalledWith('arrow');
        });

        test('searchByCedantName calls mockApiService.searchByCedantName', async () => {
            await programService.searchByCedantName('cedant');
            expect(mockApiService.searchByCedantName).toHaveBeenCalledWith('cedant');
        });

        test('getRecentPrograms calls mockApiService.getRecentPrograms', async () => {
            await programService.getRecentPrograms(5);
            expect(mockApiService.getRecentPrograms).toHaveBeenCalledWith(5);
        });
    });
});
