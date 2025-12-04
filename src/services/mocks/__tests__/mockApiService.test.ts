import { mockApiService } from '../mockApiService';

// Mock dependencies
jest.mock('@/services/mockData/programMockData', () => ({
    mockPrograms: [
        { id: '1', name: 'Program 1', subscribeReference: 'SUB1', arrowId: 'ARR1', cedantName: 'Cedant 1', updatedAt: '2023-01-01' },
        { id: '2', name: 'Program 2', subscribeReference: 'SUB2', arrowId: 'ARR2', cedantName: 'Cedant 2', updatedAt: '2023-01-02' },
    ],
    simulateDelay: jest.fn().mockResolvedValue(undefined),
}));

describe('mockApiService', () => {
    beforeEach(() => {
        mockApiService.resetMockData();
    });

    test('getAllPrograms returns paginated data', async () => {
        const response = await mockApiService.getAllPrograms({ limit: 1, offset: 0 });
        expect(response.data).toHaveLength(1);
        expect(response.data[0].id).toBe('1');
        expect(response.total).toBe(2);
        expect(response.page).toBe(1);
    });

    test('searchPrograms searches by cedant name or program name', async () => {
        const results = await mockApiService.searchPrograms('Program 1');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');

        const results2 = await mockApiService.searchPrograms('Cedant 2');
        expect(results2).toHaveLength(1);
        expect(results2[0].id).toBe('2');
    });

    test('searchBySubscribeReference searches by reference', async () => {
        const results = await mockApiService.searchBySubscribeReference('SUB1');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
    });

    test('searchByArrowId searches by arrow id', async () => {
        const results = await mockApiService.searchByArrowId('ARR1');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
    });

    test('searchByCedantName searches by cedant name', async () => {
        const results = await mockApiService.searchByCedantName('Cedant 1');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
    });

    test('getProgramById returns program', async () => {
        const program = await mockApiService.getProgramById('1');
        expect(program.id).toBe('1');
    });

    test('getProgramById throws error if not found', async () => {
        await expect(mockApiService.getProgramById('999')).rejects.toThrow('Program with ID 999 not found');
    });

    test('getRecentPrograms returns sorted programs', async () => {
        const programs = await mockApiService.getRecentPrograms();
        expect(programs).toHaveLength(2);
        expect(programs[0].id).toBe('2'); // Most recent first
        expect(programs[1].id).toBe('1');
    });

    test('createProgram adds a new program', async () => {
        const newProgram = await mockApiService.createProgram({ name: 'New Program' } as any);
        expect(newProgram.id).toBeDefined();
        expect(newProgram.name).toBe('New Program');

        const allPrograms = await mockApiService.getAllPrograms();
        expect(allPrograms.total).toBe(3);
    });

    test('updateProgram updates existing program', async () => {
        const updated = await mockApiService.updateProgram('1', { name: 'Updated Name' });
        expect(updated.name).toBe('Updated Name');

        const program = await mockApiService.getProgramById('1');
        expect(program.name).toBe('Updated Name');
    });

    test('updateProgram throws error if not found', async () => {
        await expect(mockApiService.updateProgram('999', {})).rejects.toThrow('Program with ID 999 not found');
    });

    test('deleteProgram removes program', async () => {
        await mockApiService.deleteProgram('1');

        const allPrograms = await mockApiService.getAllPrograms();
        expect(allPrograms.total).toBe(1);

        await expect(mockApiService.getProgramById('1')).rejects.toThrow();
    });

    test('deleteProgram throws error if not found', async () => {
        await expect(mockApiService.deleteProgram('999')).rejects.toThrow('Program with ID 999 not found');
    });
});
