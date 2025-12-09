import { isValidEmail, isRequired } from '../validators';

describe('validators', () => {
    describe('isValidEmail', () => {
        it('should validate correct email', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        it('should invalidate incorrect email', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
        });
    });

    describe('isRequired', () => {
        it('should return true for valid values', () => {
            expect(isRequired('test')).toBe(true);
            expect(isRequired(['item'])).toBe(true);
            expect(isRequired(123)).toBe(true);
            expect(isRequired(true)).toBe(true);
        });

        it('should return false for empty/null/undefined values', () => {
            expect(isRequired(null)).toBe(false);
            expect(isRequired(undefined)).toBe(false);
            expect(isRequired('')).toBe(false);
            expect(isRequired([])).toBe(false);
            expect(isRequired('   ')).toBe(false);
        });
    });
});
