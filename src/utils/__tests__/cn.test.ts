import { cn } from '../cn';

describe('cn utility', () => {
    it('should merge class names', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
        expect(cn('class1', undefined, null, false && 'class-false', true && 'class-true')).toBe('class1 class-true');
    });

    it('should merge tailwind classes', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });
});
