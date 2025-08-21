import { trimChars } from './string';

describe('trimChars', () => {
    it('should trim spaces by default', () => {
        expect(trimChars('  hello  ')).toBe('hello');
        expect(trimChars(' hello world ')).toBe('hello world');
    });

    it('should trim specified characters', () => {
        expect(trimChars('###hello###', ['#'])).toBe('hello');
        expect(trimChars('...test...', ['.'])).toBe('test');
    });

    it('should trim multiple different characters', () => {
        expect(trimChars('#.!hello#.!', ['#', '.', '!'])).toBe('hello');
        expect(trimChars('123test456', ['1', '2', '3', '4', '5', '6'])).toBe('test');
    });

    it('should not trim characters in the middle of the string', () => {
        expect(trimChars('hello world', [' '])).toBe('hello world');
        expect(trimChars('#hello#world#', ['#'])).toBe('hello#world');
    });
});