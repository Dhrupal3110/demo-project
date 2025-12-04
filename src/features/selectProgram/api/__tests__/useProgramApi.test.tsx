import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { programService } from '@/services/programService';
import {
  useAllPrograms,
  useSearchPrograms,
  useRecentPrograms,
  useProgramById,
  useProgramMutations,
} from '../useProgramApi';

// Mock programService
jest.mock('@/services/programService', () => ({
  programService: {
    getAllPrograms: jest.fn(),
    searchPrograms: jest.fn(),
    getRecentPrograms: jest.fn(),
    getProgramById: jest.fn(),
    createProgram: jest.fn(),
    updateProgram: jest.fn(),
    deleteProgram: jest.fn(),
  },
}));

const mockPrograms = [
  { id: '1', name: 'Program 1' },
  { id: '2', name: 'Program 2' },
];

describe('useProgramApi', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  test('useAllPrograms fetches programs', async () => {
    (programService.getAllPrograms as jest.Mock).mockResolvedValue(mockPrograms);

    const { result } = renderHook(() => useAllPrograms(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPrograms);
    expect(programService.getAllPrograms).toHaveBeenCalled();
  });

  test('useSearchPrograms searches programs', async () => {
    (programService.searchPrograms as jest.Mock).mockResolvedValue(mockPrograms);

    const { result } = renderHook(() => useSearchPrograms('query'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPrograms);
    expect(programService.searchPrograms).toHaveBeenCalledWith('query');
  });

  test('useRecentPrograms fetches recent programs', async () => {
    (programService.getRecentPrograms as jest.Mock).mockResolvedValue(mockPrograms);

    const { result } = renderHook(() => useRecentPrograms(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPrograms);
    expect(programService.getRecentPrograms).toHaveBeenCalledWith(5);
  });

  test('useProgramById fetches program by id', async () => {
    const mockProgram = mockPrograms[0];
    (programService.getProgramById as jest.Mock).mockResolvedValue(mockProgram);

    const { result } = renderHook(() => useProgramById('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProgram);
    expect(programService.getProgramById).toHaveBeenCalledWith('1');
  });

  test('useProgramMutations creates program', async () => {
    const newProgram = { name: 'New Program' };
    const createdProgram = { id: '3', ...newProgram };
    (programService.createProgram as jest.Mock).mockResolvedValue(createdProgram);

    const { result } = renderHook(() => useProgramMutations(), { wrapper });

    result.current.createProgram.mutate(newProgram as any);

    await waitFor(() => expect(result.current.createProgram.isSuccess).toBe(true));

    expect(programService.createProgram).toHaveBeenCalledWith(newProgram);
  });

  test('useProgramMutations updates program', async () => {
    const updates = { name: 'Updated Program' };
    const updatedProgram = { id: '1', ...updates };
    (programService.updateProgram as jest.Mock).mockResolvedValue(updatedProgram);

    const { result } = renderHook(() => useProgramMutations(), { wrapper });

    result.current.updateProgram.mutate({ id: '1', updates });

    await waitFor(() => expect(result.current.updateProgram.isSuccess).toBe(true));

    expect(programService.updateProgram).toHaveBeenCalledWith('1', updates);
  });

  test('useProgramMutations deletes program', async () => {
    (programService.deleteProgram as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useProgramMutations(), { wrapper });

    result.current.deleteProgram.mutate('1');

    await waitFor(() => expect(result.current.deleteProgram.isSuccess).toBe(true));

    expect(programService.deleteProgram).toHaveBeenCalledWith('1');
  });
});
