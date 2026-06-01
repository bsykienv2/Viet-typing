import { wordToKeys, stringToKeys, buildCharMappings, validateInput, getNextHighlightKey, getPossiblePaths, getCharColorStates } from '../vietnameseTyping';

describe('VNI Typing Utilities', () => {
  describe('wordToKeys (VNI)', () => {
    test('should decompose simple characters with tone marks', () => {
      expect(wordToKeys('á', 'vni')).toEqual(['a', '1']);
      expect(wordToKeys('à', 'vni')).toEqual(['a', '2']);
      expect(wordToKeys('ả', 'vni')).toEqual(['a', '3']);
      expect(wordToKeys('ã', 'vni')).toEqual(['a', '4']);
      expect(wordToKeys('ạ', 'vni')).toEqual(['a', '5']);
    });

    test('should decompose characters with circumflex/breve/horn and tone marks', () => {
      expect(wordToKeys('ấ', 'vni')).toEqual(['a', '6', '1']);
      expect(wordToKeys('ầ', 'vni')).toEqual(['a', '6', '2']);
      expect(wordToKeys('ắ', 'vni')).toEqual(['a', '8', '1']);
      expect(wordToKeys('ặ', 'vni')).toEqual(['a', '8', '5']);
      expect(wordToKeys('đ', 'vni')).toEqual(['d', '9']);
      expect(wordToKeys('ướ', 'vni')).toEqual(['u', '7', 'o', '7', '1']);
    });

    test('should place tone mark at the end of simple words', () => {
      expect(wordToKeys('ná', 'vni')).toEqual(['n', 'a', '1']);
      expect(wordToKeys('nà', 'vni')).toEqual(['n', 'a', '2']);
      expect(wordToKeys('lá', 'vni')).toEqual(['l', 'a', '1']);
      expect(wordToKeys('là', 'vni')).toEqual(['l', 'a', '2']);
    });

    test('should handle complex Vietnamese words with tone mark after the vowel', () => {
      expect(wordToKeys('thuyền', 'vni')).toEqual(['t', 'h', 'u', 'y', 'e', '6', '2', 'n']);
      expect(wordToKeys('đường', 'vni')).toEqual(['d', '9', 'u', '7', 'o', '7', '2', 'n', 'g']);
      expect(wordToKeys('học', 'vni')).toEqual(['h', 'o', '5', 'c']);
    });

    test('should handle words with punctuation marks at the end', () => {
      expect(wordToKeys('học.', 'vni')).toEqual(['h', 'o', '5', 'c', '.']);
      expect(wordToKeys('cơm,', 'vni')).toEqual(['c', 'o', '7', 'm', ',']);
      expect(wordToKeys('Tôi', 'vni')).toEqual(['T', 'o', '6', 'i']);
      expect(wordToKeys('để', 'vni')).toEqual(['d', '9', 'e', '6', '3']);
    });

    test('should normalize NFD Unicode (decomposed) input correctly', () => {
      const nfdWord = 'đê\u0309'; // "để" in NFD form
      expect(wordToKeys(nfdWord, 'vni')).toEqual(['d', '9', 'e', '6', '3']);
    });
  });

  describe('stringToKeys (VNI)', () => {
    test('should convert simple sentences', () => {
      expect(stringToKeys('á à', 'vni')).toEqual(['a', '1', ' ', 'a', '2']);
      expect(stringToKeys('ná nà lá là', 'vni')).toEqual([
        'n', 'a', '1', ' ', 'n', 'a', '2', ' ',
        'l', 'a', '1', ' ', 'l', 'a', '2'
      ]);
    });
  });

  describe('buildCharMappings (VNI)', () => {
    test('should map characters to correct VNI indices for simple text', () => {
      const mappings = buildCharMappings('ná nà', 'vni');
      
      expect(mappings).toHaveLength(5); // 'n', 'á', ' ', 'n', 'à'
      
      // 'n'
      expect(mappings[0]).toEqual({
        char: 'n',
        keys: ['n'],
        startIndex: 0,
        endIndex: 1
      });

      // 'á'
      expect(mappings[1]).toEqual({
        char: 'á',
        keys: ['a', '1'],
        startIndex: 1,
        endIndex: 3
      });

      // ' '
      expect(mappings[2]).toEqual({
        char: ' ',
        keys: [' '],
        startIndex: 3,
        endIndex: 4
      });

      // 'n'
      expect(mappings[3]).toEqual({
        char: 'n',
        keys: ['n'],
        startIndex: 4,
        endIndex: 5
      });

      // 'à'
      expect(mappings[4]).toEqual({
        char: 'à',
        keys: ['a', '2'],
        startIndex: 5,
        endIndex: 7
      });
    });
  });

  describe('validateInput (VNI)', () => {
    test('should validate correct typing paths for "toàn"', () => {
      // Way 1: Tone mark in middle of word (t-o-a-2-n)
      expect(validateInput('toàn', 'toa', 'vni')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorIndex: -1, currentProgressIndex: 3 });
      expect(validateInput('toàn', 'toà', 'vni')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorIndex: -1, currentProgressIndex: 4 });
      expect(validateInput('toàn', 'toàn', 'vni')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorIndex: -1, currentProgressIndex: 5 });

      // Way 2: Tone mark at the end of word (t-o-a-n-2)
      expect(validateInput('toàn', 'toan', 'vni')).toEqual({ isValid: true, errorWordIndex: -1, firstErrorIndex: -1, currentProgressIndex: 4 });
      
      // Error case
      expect(validateInput('toàn', 'toam', 'vni')).toEqual({ isValid: false, errorWordIndex: 0, firstErrorIndex: 3, currentProgressIndex: 3 });
    });
  });

  describe('getNextHighlightKey (VNI)', () => {
    test('should suggest next key correctly for "toàn"', () => {
      expect(getNextHighlightKey('toàn', '', 'vni')).toBe('t');
      expect(getNextHighlightKey('toàn', 't', 'vni')).toBe('o');
      expect(getNextHighlightKey('toàn', 'to', 'vni')).toBe('a');
      // When "toa" is typed, default to tone mark '2'
      expect(getNextHighlightKey('toàn', 'toa', 'vni')).toBe('2');
      // If user chooses to type "toan", next suggested key should be '2'
      expect(getNextHighlightKey('toàn', 'toan', 'vni')).toBe('2');
      // When complete, return null
      expect(getNextHighlightKey('toàn', 'toàn', 'vni')).toBeNull();
    });

    test('should suggest backspace when there is an error', () => {
      expect(getNextHighlightKey('toàn', 'toam', 'vni')).toBe('⌫');
    });

    test('should suggest space after completing a word in a sentence', () => {
      expect(getNextHighlightKey('học sinh', 'học', 'vni')).toBe(' ');
    });
  });

  describe('getPossiblePaths (VNI)', () => {
    test('should generate correct paths and mappings for "toàn"', () => {
      const paths = getPossiblePaths('toàn', 'vni');
      expect(paths).toHaveLength(2);

      // Path 1 (Tone mark 2 right after 'a')
      expect(paths[0].keys).toEqual(['t', 'o', 'a', '2', 'n']);
      expect(paths[0].charToKeyIndices[0]).toEqual([0]); // t
      expect(paths[0].charToKeyIndices[1]).toEqual([1]); // o
      expect(paths[0].charToKeyIndices[2]).toEqual([2, 3]); // à
      expect(paths[0].charToKeyIndices[3]).toEqual([4]); // n

      // Path 2 (Tone mark 2 at the end)
      expect(paths[1].keys).toEqual(['t', 'o', 'a', 'n', '2']);
      expect(paths[1].charToKeyIndices[0]).toEqual([0]); // t
      expect(paths[1].charToKeyIndices[1]).toEqual([1]); // o
      expect(paths[1].charToKeyIndices[2]).toEqual([2, 4]); // à
      expect(paths[1].charToKeyIndices[3]).toEqual([3]); // n
    });
  });

  describe('getCharColorStates (VNI)', () => {
    test('should return correct color states when typing "toàn" in different ways', () => {
      expect(getCharColorStates('toàn', '', 'vni')).toEqual(['current', 'none', 'none', 'none']);
      expect(getCharColorStates('toàn', 'toa', 'vni')).toEqual(['correct', 'correct', 'current', 'none']);
      expect(getCharColorStates('toàn', 'toan', 'vni')).toEqual(['correct', 'correct', 'current', 'none']);
      expect(getCharColorStates('toàn', 'toàn', 'vni')).toEqual(['correct', 'correct', 'correct', 'correct']);
      expect(getCharColorStates('toàn', 'toan2', 'vni')).toEqual(['correct', 'correct', 'correct', 'correct']);
      expect(getCharColorStates('toàn', 'toam', 'vni')).toEqual(['correct', 'correct', 'incorrect', 'none']);
    });
  });
});
