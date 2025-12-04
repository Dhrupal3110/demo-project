import programReducer, { setSelectedProgram, clearSelectedProgram } from '../programSlice';
import type { Program } from '../types';

describe('programSlice', () => {
    const initialState = {
        selectedProgram: null,
        allPrograms: [
            {
                id: 'PRG001',
                name: 'Customer Loyalty Program',
                description: 'Rewards program for loyal customers',
                status: 'active',
                createdAt: '2024-01-15',
                updatedAt: '2024-11-01',
            },
            // ... other initial programs (we don't need to assert all of them, just that they exist)
        ],
    };

    it('should handle initial state', () => {
        expect(programReducer(undefined, { type: 'unknown' })).toEqual(expect.objectContaining({
            selectedProgram: null,
            allPrograms: expect.any(Array),
        }));
    });

    it('should handle setSelectedProgram', () => {
        const program: Program = {
            id: '1',
            name: 'Test Program',
            description: 'Test Description',
            status: 'active',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
        };
        const actual = programReducer(initialState as any, setSelectedProgram(program));
        expect(actual.selectedProgram).toEqual(program);
    });

    it('should handle clearSelectedProgram', () => {
        const stateWithProgram = {
            ...initialState,
            selectedProgram: {
                id: '1',
                name: 'Test Program',
                description: 'Test Description',
                status: 'active',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
            },
        };
        const actual = programReducer(stateWithProgram as any, clearSelectedProgram());
        expect(actual.selectedProgram).toBeNull();
    });
});
