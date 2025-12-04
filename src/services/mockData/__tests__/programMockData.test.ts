import { simulateDelay, mockPrograms } from '../programMockData';

describe('programMockData', () => {
    it('should export mock programs', () => {
        expect(mockPrograms).toBeDefined();
        expect(Array.isArray(mockPrograms)).toBe(true);
        expect(mockPrograms.length).toBeGreaterThan(0);
    });

    it('simulateDelay should resolve after delay', async () => {
        jest.useFakeTimers();
        const promise = simulateDelay(1000);
        jest.advanceTimersByTime(1000);
        await expect(promise).resolves.toBeUndefined();
        jest.useRealTimers();
    });

    it('simulateDelay should use default delay', async () => {
        jest.useFakeTimers();
        const promise = simulateDelay();
        jest.advanceTimersByTime(800);
        await expect(promise).resolves.toBeUndefined();
        jest.useRealTimers();
    });
});
