import * as typing from './vietnameseTyping';

export interface CharMapping {
  char: string;
  telexKeys: string[];
  startIndex: number;
  endIndex: number;
}

export interface PossiblePath {
  keys: string[];
  charToKeyIndices: Record<number, number[]>;
}

export interface ValidationResult {
  isValid: boolean;
  errorWordIndex: number;
  firstErrorTelexIndex: number;
  currentProgressIndex: number;
}

export function wordToTelexKeys(word: string): string[] {
  return typing.wordToKeys(word, 'telex');
}

export function stringToTelexKeys(text: string): string[] {
  return typing.stringToKeys(text, 'telex');
}

export function buildCharMappings(text: string): CharMapping[] {
  const mappings = typing.buildCharMappings(text, 'telex');
  return mappings.map(m => ({
    char: m.char,
    telexKeys: m.keys,
    startIndex: m.startIndex,
    endIndex: m.endIndex
  }));
}

export function getPossibleTelexKeys(word: string): string[][] {
  return typing.getPossibleKeys(word, 'telex');
}

export function validateInput(targetText: string, inputText: string): ValidationResult {
  const res = typing.validateInput(targetText, inputText, 'telex');
  return {
    isValid: res.isValid,
    errorWordIndex: res.errorWordIndex,
    firstErrorTelexIndex: res.firstErrorIndex,
    currentProgressIndex: res.currentProgressIndex
  };
}

export function getNextHighlightKey(targetText: string, inputText: string): string | null {
  return typing.getNextHighlightKey(targetText, inputText, 'telex');
}

export function getPossiblePaths(word: string): PossiblePath[] {
  return typing.getPossiblePaths(word, 'telex');
}

export function getCharColorStates(targetText: string, inputText: string): ('correct' | 'incorrect' | 'current' | 'none')[] {
  return typing.getCharColorStates(targetText, inputText, 'telex');
}
