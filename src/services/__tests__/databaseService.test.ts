import { databaseService } from '../databaseService';
import { apiClient } from '../client/apiClient';
import { mockDatabaseService } from '../mocks/mockDatabaseService';
import { mockStepperService } from '../mocks/mockSidebarStepperService';
import { API_CONFIG } from '../config/apiConfig';

jest.mock('../client/apiClient');
jest.mock('../mocks/mockDatabaseService');
jest.mock('../mocks/mockSidebarStepperService');
jest.mock('../config/apiConfig', () => ({
    API_CONFIG: { useDummyAPI: false },
}));

describe('databaseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (API_CONFIG as any).useDummyAPI = false;
    });

    describe('when useDummyAPI is false', () => {
        test('getAllDatabases calls apiClient.get', async () => {
            const mockData = { data: [], total: 0 };
            (apiClient.get as jest.Mock).mockResolvedValue(mockData);
            const res = await databaseService.getAllDatabases();
            expect(apiClient.get).toHaveBeenCalledWith('/databases', { params: undefined });
            expect(res).toEqual(mockData);
        });

        test('searchDatabases calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.searchDatabases('q');
            expect(apiClient.get).toHaveBeenCalledWith('/databases/search', { params: { q: 'q' } });
            expect(res).toEqual(mockData);
        });

        test('getDatabaseById calls apiClient.get', async () => {
            const mockData = { id: '1' };
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.getDatabaseById('1');
            expect(apiClient.get).toHaveBeenCalledWith('/databases/1');
            expect(res).toEqual(mockData);
        });

        test('getDatabasesByIds calls apiClient.post', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.post as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.getDatabasesByIds(['1']);
            expect(apiClient.post).toHaveBeenCalledWith('/databases/bulk', { ids: ['1'] });
            expect(res).toEqual(mockData);
        });

        test('getDatabasesByStatus calls apiClient.get', async () => {
            const mockData = [{ id: '1' }];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.getDatabasesByStatus('active');
            expect(apiClient.get).toHaveBeenCalledWith('/databases/by-status', { params: { status: 'active' } });
            expect(res).toEqual(mockData);
        });

        test('createDatabase calls apiClient.post', async () => {
            const mockData = { id: '1' };
            (apiClient.post as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.createDatabase({ name: 'db' } as any);
            expect(apiClient.post).toHaveBeenCalledWith('/databases', { name: 'db' });
            expect(res).toEqual(mockData);
        });

        test('updateDatabase calls apiClient.put', async () => {
            const mockData = { id: '1' };
            (apiClient.put as jest.Mock).mockResolvedValue({ data: mockData });
            const res = await databaseService.updateDatabase('1', {});
            expect(apiClient.put).toHaveBeenCalledWith('/databases/1', {});
            expect(res).toEqual(mockData);
        });

        test('deleteDatabase calls apiClient.delete', async () => {
            (apiClient.delete as jest.Mock).mockResolvedValue({});
            await databaseService.deleteDatabase('1');
            expect(apiClient.delete).toHaveBeenCalledWith('/databases/1');
        });

        test('getDatabaseStats calls apiClient.get', async () => {
            (apiClient.get as jest.Mock).mockResolvedValue({ total: 10 });
            const res = await databaseService.getDatabaseStats();
            expect(apiClient.get).toHaveBeenCalledWith('/databases/stats');
            expect(res).toEqual({ total: 10 });
        });

        test('saveStepData calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue('ok');
            await databaseService.saveStepData({});
            expect(apiClient.post).toHaveBeenCalledWith('/databases/step/save', {});
        });

        test('validateStep calls apiClient.post', async () => {
            (apiClient.post as jest.Mock).mockResolvedValue({ valid: true });
            await databaseService.validateStep({});
            expect(apiClient.post).toHaveBeenCalledWith('/databases/step/validate', {});
        });
    });

    describe('when useDummyAPI is true', () => {
        beforeEach(() => {
            (API_CONFIG as any).useDummyAPI = true;
        });

        test('getAllDatabases calls mock', async () => {
            await databaseService.getAllDatabases();
            expect(mockDatabaseService.getAllDatabases).toHaveBeenCalled();
        });

        test('searchDatabases calls mock', async () => {
            await databaseService.searchDatabases('q');
            expect(mockDatabaseService.searchDatabases).toHaveBeenCalledWith('q');
        });

        test('getDatabaseById calls mock', async () => {
            await databaseService.getDatabaseById('1');
            expect(mockDatabaseService.getDatabaseById).toHaveBeenCalledWith('1');
        });

        test('getDatabasesByIds calls mock', async () => {
            await databaseService.getDatabasesByIds(['1']);
            expect(mockDatabaseService.getDatabasesByIds).toHaveBeenCalledWith(['1']);
        });

        test('getDatabasesByStatus calls mock', async () => {
            await databaseService.getDatabasesByStatus('active');
            expect(mockDatabaseService.getDatabasesByStatus).toHaveBeenCalledWith('active');
        });

        test('createDatabase calls mock', async () => {
            await databaseService.createDatabase({ name: 'db' } as any);
            expect(mockDatabaseService.createDatabase).toHaveBeenCalled();
        });

        test('updateDatabase calls mock', async () => {
            await databaseService.updateDatabase('1', {});
            expect(mockDatabaseService.updateDatabase).toHaveBeenCalledWith('1', {});
        });

        test('deleteDatabase calls mock', async () => {
            await databaseService.deleteDatabase('1');
            expect(mockDatabaseService.deleteDatabase).toHaveBeenCalledWith('1');
        });

        test('getDatabaseStats calls mock', async () => {
            await databaseService.getDatabaseStats();
            expect(mockDatabaseService.getDatabaseStats).toHaveBeenCalled();
        });

        test('saveStepData calls mockStepperService', async () => {
            await databaseService.saveStepData({});
            expect(mockStepperService.saveStepData).toHaveBeenCalledWith(2, {});
        });

        test('validateStep calls mockStepperService', async () => {
            await databaseService.validateStep({});
            expect(mockStepperService.validateStep).toHaveBeenCalledWith(2, {});
        });
    });
});
