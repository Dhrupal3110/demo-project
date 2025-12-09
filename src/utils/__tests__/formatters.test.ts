import { formatCurrency, formatDate } from '../formatters';

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('should format USD by default', () => {
            expect(formatCurrency(1000)).toMatch(/\$1,000\.00/);
        });

        it('should format other currencies', () => {
            expect(formatCurrency(1000, 'EUR')).toMatch(/€1,000\.00/);
        });
    });

    describe('formatDate', () => {
        it('should format date string', () => {
            const date = '2023-01-01T00:00:00.000Z';
            expect(formatDate(date)).toMatch(/January 1, 2023/);
        });
    });
});
