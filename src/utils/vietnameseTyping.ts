export type InputMethod = 'telex' | 'vni';

export interface CharMapping {
  char: string;
  keys: string[];
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
  firstErrorIndex: number;
  currentProgressIndex: number;
}

// ==================== TELEX MAPPINGS ====================
const telexToneMarks: Record<string, { char: string; mark: string }> = {
  // Sắc
  'á': { char: 'a', mark: 's' }, 'ấ': { char: 'â', mark: 's' }, 'ắ': { char: 'ă', mark: 's' },
  'é': { char: 'e', mark: 's' }, 'ế': { char: 'ê', mark: 's' }, 'í': { char: 'i', mark: 's' },
  'ó': { char: 'o', mark: 's' }, 'ố': { char: 'ô', mark: 's' }, 'ớ': { char: 'ơ', mark: 's' },
  'ú': { char: 'u', mark: 's' }, 'ứ': { char: 'ư', mark: 's' }, 'ý': { char: 'y', mark: 's' },
  'Á': { char: 'A', mark: 's' }, 'Ấ': { char: 'Â', mark: 's' }, 'Ắ': { char: 'Ă', mark: 's' },
  'É': { char: 'E', mark: 's' }, 'Ế': { char: 'Ê', mark: 's' }, 'Í': { char: 'I', mark: 's' },
  'Ó': { char: 'O', mark: 's' }, 'Ố': { char: 'Ô', mark: 's' }, 'Ớ': { char: 'Ơ', mark: 's' },
  'Ú': { char: 'U', mark: 's' }, 'Ứ': { char: 'Ư', mark: 's' }, 'Ý': { char: 'Y', mark: 's' },

  // Huyền
  'à': { char: 'a', mark: 'f' }, 'ầ': { char: 'â', mark: 'f' }, 'ằ': { char: 'ă', mark: 'f' },
  'è': { char: 'e', mark: 'f' }, 'ề': { char: 'ê', mark: 'f' }, 'ì': { char: 'i', mark: 'f' },
  'ò': { char: 'o', mark: 'f' }, 'ồ': { char: 'ô', mark: 'f' }, 'ờ': { char: 'ơ', mark: 'f' },
  'ù': { char: 'u', mark: 'f' }, 'ừ': { char: 'ư', mark: 'f' }, 'ỳ': { char: 'y', mark: 'f' },
  'À': { char: 'A', mark: 'f' }, 'Ầ': { char: 'Â', mark: 'f' }, 'Ằ': { char: 'Ă', mark: 'f' },
  'È': { char: 'E', mark: 'f' }, 'Ề': { char: 'Ê', mark: 'f' }, 'Ì': { char: 'I', mark: 'f' },
  'Ò': { char: 'O', mark: 'f' }, 'Ồ': { char: 'Ô', mark: 'f' }, 'Ờ': { char: 'Ơ', mark: 'f' },
  'Ù': { char: 'U', mark: 'f' }, 'Ừ': { char: 'Ư', mark: 'f' }, 'Ỳ': { char: 'Y', mark: 'f' },

  // Hỏi
  'ả': { char: 'a', mark: 'r' }, 'ẩ': { char: 'â', mark: 'r' }, 'ẳ': { char: 'ă', mark: 'r' },
  'ẻ': { char: 'e', mark: 'r' }, 'ể': { char: 'ê', mark: 'r' }, 'ỉ': { char: 'i', mark: 'r' },
  'ỏ': { char: 'o', mark: 'r' }, 'ổ': { char: 'ô', mark: 'r' }, 'ở': { char: 'ơ', mark: 'r' },
  'ủ': { char: 'u', mark: 'r' }, 'ử': { char: 'ư', mark: 'r' }, 'ỷ': { char: 'y', mark: 'r' },
  'Ả': { char: 'A', mark: 'r' }, 'Ẩ': { char: 'Â', mark: 'r' }, 'Ẳ': { char: 'Ă', mark: 'r' },
  'Ẻ': { char: 'E', mark: 'r' }, 'Ể': { char: 'Ê', mark: 'r' }, 'Ỉ': { char: 'I', mark: 'r' },
  'Ỏ': { char: 'O', mark: 'r' }, 'Ở': { char: 'Ơ', mark: 'r' }, 'Ủ': { char: 'U', mark: 'r' },
  'Ử': { char: 'Ư', mark: 'r' }, 'Ỷ': { char: 'Y', mark: 'r' },

  // Ngã
  'ã': { char: 'a', mark: 'x' }, 'ẫ': { char: 'â', mark: 'x' }, 'ẵ': { char: 'ă', mark: 'x' },
  'ẽ': { char: 'e', mark: 'x' }, 'ễ': { char: 'ê', mark: 'x' }, 'ĩ': { char: 'i', mark: 'x' },
  'õ': { char: 'o', mark: 'x' }, 'ỗ': { char: 'ô', mark: 'x' }, 'ỡ': { char: 'ơ', mark: 'x' },
  'ũ': { char: 'u', mark: 'x' }, 'ữ': { char: 'ư', mark: 'x' }, 'ỹ': { char: 'y', mark: 'x' },
  'Ã': { char: 'A', mark: 'x' }, 'Ẫ': { char: 'Â', mark: 'x' }, 'Ẵ': { char: 'Ă', mark: 'x' },
  'Ẽ': { char: 'E', mark: 'x' }, 'Ễ': { char: 'Ê', mark: 'x' }, 'Ĩ': { char: 'I', mark: 'x' },
  'Õ': { char: 'O', mark: 'x' }, 'Ỗ': { char: 'Ô', mark: 'x' }, 'Ỡ': { char: 'Ơ', mark: 'x' },
  'Ũ': { char: 'U', mark: 'x' }, 'Ữ': { char: 'Ư', mark: 'x' }, 'Ỹ': { char: 'Y', mark: 'x' },

  // Nặng
  'ạ': { char: 'a', mark: 'j' }, 'ậ': { char: 'â', mark: 'j' }, 'ặ': { char: 'ă', mark: 'j' },
  'ẹ': { char: 'e', mark: 'j' }, 'ệ': { char: 'ê', mark: 'j' }, 'ị': { char: 'i', mark: 'j' },
  'ọ': { char: 'o', mark: 'j' }, 'ộ': { char: 'ô', mark: 'j' }, 'ợ': { char: 'ơ', mark: 'j' },
  'ụ': { char: 'u', mark: 'j' }, 'ự': { char: 'ư', mark: 'j' }, 'ỵ': { char: 'y', mark: 'j' },
  'Ạ': { char: 'A', mark: 'j' }, 'Ậ': { char: 'Â', mark: 'j' }, 'Ặ': { char: 'Ă', mark: 'j' },
  'Ẹ': { char: 'E', mark: 'j' }, 'Ệ': { char: 'Ê', mark: 'j' }, 'Ị': { char: 'I', mark: 'j' },
  'Ọ': { char: 'O', mark: 'j' }, 'Ộ': { char: 'Ô', mark: 'j' }, 'Ợ': { char: 'Ơ', mark: 'j' },
  'Ụ': { char: 'U', mark: 'j' }, 'Ự': { char: 'Ư', mark: 'j' }, 'Ỵ': { char: 'Y', mark: 'j' }
};

const telexDiacriticMarks: Record<string, string[]> = {
  'â': ['a', 'a'], 'ă': ['a', 'w'], 'ê': ['e', 'e'],
  'ô': ['o', 'o'], 'ơ': ['o', 'w'], 'ư': ['u', 'w'],
  'đ': ['d', 'd'],
  'Â': ['A', 'a'], 'Ă': ['A', 'w'], 'Ê': ['E', 'e'],
  'Ô': ['O', 'o'], 'Ơ': ['O', 'w'], 'Ư': ['U', 'w'],
  'Đ': ['D', 'd']
};

// ==================== VNI MAPPINGS ====================
const vniToneMarks: Record<string, { char: string; mark: string }> = {
  // Sắc
  'á': { char: 'a', mark: '1' }, 'ấ': { char: 'â', mark: '1' }, 'ắ': { char: 'ă', mark: '1' },
  'é': { char: 'e', mark: '1' }, 'ế': { char: 'ê', mark: '1' }, 'í': { char: 'i', mark: '1' },
  'ó': { char: 'o', mark: '1' }, 'ố': { char: 'ô', mark: '1' }, 'ớ': { char: 'ơ', mark: '1' },
  'ú': { char: 'u', mark: '1' }, 'ứ': { char: 'ư', mark: '1' }, 'ý': { char: 'y', mark: '1' },
  'Á': { char: 'A', mark: '1' }, 'Ấ': { char: 'Â', mark: '1' }, 'Ắ': { char: 'Ă', mark: '1' },
  'É': { char: 'E', mark: '1' }, 'Ế': { char: 'Ê', mark: '1' }, 'Í': { char: 'I', mark: '1' },
  'Ó': { char: 'O', mark: '1' }, 'Ố': { char: 'Ô', mark: '1' }, 'Ớ': { char: 'Ơ', mark: '1' },
  'Ú': { char: 'U', mark: '1' }, 'Ứ': { char: 'Ư', mark: '1' }, 'Ý': { char: 'Y', mark: '1' },

  // Huyền
  'à': { char: 'a', mark: '2' }, 'ầ': { char: 'â', mark: '2' }, 'ằ': { char: 'ă', mark: '2' },
  'è': { char: 'e', mark: '2' }, 'ề': { char: 'ê', mark: '2' }, 'ì': { char: 'i', mark: '2' },
  'ò': { char: 'o', mark: '2' }, 'ồ': { char: 'ô', mark: '2' }, 'ờ': { char: 'ơ', mark: '2' },
  'ù': { char: 'u', mark: '2' }, 'ừ': { char: 'ư', mark: '2' }, 'ỳ': { char: 'y', mark: '2' },
  'À': { char: 'A', mark: '2' }, 'Ầ': { char: 'Â', mark: '2' }, 'Ằ': { char: 'Ă', mark: '2' },
  'È': { char: 'E', mark: '2' }, 'Ề': { char: 'Ê', mark: '2' }, 'Ì': { char: 'I', mark: '2' },
  'Ò': { char: 'O', mark: '2' }, 'Ồ': { char: 'Ô', mark: '2' }, 'Ờ': { char: 'Ơ', mark: '2' },
  'Ù': { char: 'U', mark: '2' }, 'Ừ': { char: 'Ư', mark: '2' }, 'Ỳ': { char: 'Y', mark: '2' },

  // Hỏi
  'ả': { char: 'a', mark: '3' }, 'ẩ': { char: 'â', mark: '3' }, 'ẳ': { char: 'ă', mark: '3' },
  'ẻ': { char: 'e', mark: '3' }, 'ể': { char: 'ê', mark: '3' }, 'ỉ': { char: 'i', mark: '3' },
  'ỏ': { char: 'o', mark: '3' }, 'ổ': { char: 'ô', mark: '3' }, 'ở': { char: 'ơ', mark: '3' },
  'ủ': { char: 'u', mark: '3' }, 'ử': { char: 'ư', mark: '3' }, 'ỷ': { char: 'y', mark: '3' },
  'Ả': { char: 'A', mark: '3' }, 'Ẩ': { char: 'Â', mark: '3' }, 'Ẳ': { char: 'Ă', mark: '3' },
  'Ẻ': { char: 'E', mark: '3' }, 'Ể': { char: 'Ê', mark: '3' }, 'Ỉ': { char: 'I', mark: '3' },
  'Ỏ': { char: 'O', mark: '3' }, 'Ở': { char: 'Ơ', mark: '3' }, 'Ủ': { char: 'U', mark: '3' },
  'Ử': { char: 'Ư', mark: '3' }, 'Ỷ': { char: 'Y', mark: '3' },

  // Ngã
  'ã': { char: 'a', mark: '4' }, 'ẫ': { char: 'â', mark: '4' }, 'ẵ': { char: 'ă', mark: '4' },
  'ẽ': { char: 'e', mark: '4' }, 'ễ': { char: 'ê', mark: '4' }, 'ĩ': { char: 'i', mark: '4' },
  'õ': { char: 'o', mark: '4' }, 'ỗ': { char: 'ô', mark: '4' }, 'ỡ': { char: 'ơ', mark: '4' },
  'ũ': { char: 'u', mark: '4' }, 'ữ': { char: 'ư', mark: '4' }, 'ỹ': { char: 'y', mark: '4' },
  'Ã': { char: 'A', mark: '4' }, 'Ẫ': { char: 'Â', mark: '4' }, 'Ẵ': { char: 'Ă', mark: '4' },
  'Ẽ': { char: 'E', mark: '4' }, 'Ễ': { char: 'Ê', mark: '4' }, 'Ĩ': { char: 'I', mark: '4' },
  'Õ': { char: 'O', mark: '4' }, 'Ỗ': { char: 'Ô', mark: '4' }, 'Ỡ': { char: 'Ơ', mark: '4' },
  'Ũ': { char: 'U', mark: '4' }, 'Ữ': { char: 'Ư', mark: '4' }, 'Ỹ': { char: 'Y', mark: '4' },

  // Nặng
  'ạ': { char: 'a', mark: '5' }, 'ậ': { char: 'â', mark: '5' }, 'ặ': { char: 'ă', mark: '5' },
  'ẹ': { char: 'e', mark: '5' }, 'ệ': { char: 'ê', mark: '5' }, 'ị': { char: 'i', mark: '5' },
  'ọ': { char: 'o', mark: '5' }, 'ộ': { char: 'ô', mark: '5' }, 'ợ': { char: 'ơ', mark: '5' },
  'ụ': { char: 'u', mark: '5' }, 'ự': { char: 'ư', mark: '5' }, 'ỵ': { char: 'y', mark: '5' },
  'Ạ': { char: 'A', mark: '5' }, 'Ậ': { char: 'Â', mark: '5' }, 'Ặ': { char: 'Ă', mark: '5' },
  'Ẹ': { char: 'E', mark: '5' }, 'Ệ': { char: 'Ê', mark: '5' }, 'Ị': { char: 'I', mark: '5' },
  'Ọ': { char: 'O', mark: '5' }, 'Ộ': { char: 'Ô', mark: '5' }, 'Ợ': { char: 'Ơ', mark: '5' },
  'Ụ': { char: 'U', mark: '5' }, 'Ự': { char: 'Ư', mark: '5' }, 'Ỵ': { char: 'Y', mark: '5' }
};

const vniDiacriticMarks: Record<string, string[]> = {
  'â': ['a', '6'], 'ă': ['a', '8'], 'ê': ['e', '6'],
  'ô': ['o', '6'], 'ơ': ['o', '7'], 'ư': ['u', '7'],
  'đ': ['d', '9'],
  'Â': ['A', '6'], 'Ă': ['A', '8'], 'Ê': ['E', '6'],
  'Ô': ['O', '6'], 'Ơ': ['O', '7'], 'Ư': ['U', '7'],
  'Đ': ['D', '9']
};

function getMaps(method: InputMethod) {
  return {
    toneMarks: method === 'vni' ? vniToneMarks : telexToneMarks,
    diacriticMarks: method === 'vni' ? vniDiacriticMarks : telexDiacriticMarks,
  };
}

export function wordToKeys(word: string, method: InputMethod): string[] {
  if (!word) return [];

  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);

  if (!match) {
    return normalizedWord.split('');
  }

  const alphaPart = match[1];
  const puncPart = match[2];
  const keys: string[] = [];

  const { toneMarks, diacriticMarks } = getMaps(method);

  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    if (toneMarks[char]) {
      const toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys.push(...diacriticMarks[cleanChar]);
      } else {
        keys.push(cleanChar);
      }
      keys.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys.push(...diacriticMarks[char]);
    } else {
      keys.push(char);
    }
  }

  if (puncPart) {
    keys.push(...puncPart.split(''));
  }

  return keys;
}

export function stringToKeys(text: string, method: InputMethod): string[] {
  if (!text) return [];
  
  const normalizedText = text.normalize('NFC');
  const words = normalizedText.split(' ');
  const result: string[] = [];

  for (let i = 0; i < words.length; i++) {
    if (i > 0) {
      result.push(' ');
    }
    result.push(...wordToKeys(words[i], method));
  }

  return result;
}

export function buildCharMappings(text: string, method: InputMethod): CharMapping[] {
  if (!text) return [];

  const normalizedText = text.normalize('NFC');
  const words = normalizedText.split(' ');
  const mappings: CharMapping[] = [];
  let currentKeyIndex = 0;

  const { toneMarks, diacriticMarks } = getMaps(method);

  for (let w = 0; w < words.length; w++) {
    if (w > 0) {
      mappings.push({
        char: ' ',
        keys: [' '],
        startIndex: currentKeyIndex,
        endIndex: currentKeyIndex + 1
      });
      currentKeyIndex += 1;
    }

    const word = words[w];
    const match = word.match(/^([\p{L}]+)([^\p{L}]*)$/u);

    if (!match) {
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        mappings.push({
          char,
          keys: [char],
          startIndex: currentKeyIndex,
          endIndex: currentKeyIndex + 1
        });
        currentKeyIndex += 1;
      }
      continue;
    }

    const alphaPart = match[1];
    const puncPart = match[2];

    let toneMark: string | null = null;
    let toneMarkCharIndex = -1;

    const alphaCharsKeys: string[][] = [];
    for (let i = 0; i < alphaPart.length; i++) {
      const char = alphaPart[i];
      if (toneMarks[char]) {
        toneMark = toneMarks[char].mark;
        toneMarkCharIndex = i;
        const cleanChar = toneMarks[char].char;
        if (diacriticMarks[cleanChar]) {
          alphaCharsKeys.push([...diacriticMarks[cleanChar]]);
        } else {
          alphaCharsKeys.push([cleanChar]);
        }
      } else if (diacriticMarks[char]) {
        alphaCharsKeys.push([...diacriticMarks[char]]);
      } else {
        alphaCharsKeys.push([char]);
      }
    }

    if (toneMark && toneMarkCharIndex !== -1) {
      alphaCharsKeys[toneMarkCharIndex].push(toneMark);
    }

    for (let i = 0; i < alphaPart.length; i++) {
      const char = alphaPart[i];
      const keys = alphaCharsKeys[i];
      mappings.push({
        char,
        keys,
        startIndex: currentKeyIndex,
        endIndex: currentKeyIndex + keys.length
      });
      currentKeyIndex += keys.length;
    }

    if (puncPart) {
      for (let i = 0; i < puncPart.length; i++) {
        const char = puncPart[i];
        mappings.push({
          char,
          keys: [char],
          startIndex: currentKeyIndex,
          endIndex: currentKeyIndex + 1
        });
        currentKeyIndex += 1;
      }
    }
  }

  return mappings;
}

export function getPossibleKeys(word: string, method: InputMethod): string[][] {
  if (!word) return [[]];
  
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  
  if (!match) {
    return [normalizedWord.split('')];
  }
  
  const alphaPart = match[1];
  const puncPart = match[2];
  
  const keys1: string[] = []; // dấu sau nguyên âm
  const keys2: string[] = []; // dấu cuối phần chữ cái
  
  let toneMark: string | null = null;
  const { toneMarks, diacriticMarks } = getMaps(method);
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    if (toneMarks[char]) {
      toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys1.push(...diacriticMarks[cleanChar]);
        keys2.push(...diacriticMarks[cleanChar]);
      } else {
        keys1.push(cleanChar);
        keys2.push(cleanChar);
      }
      keys1.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys1.push(...diacriticMarks[char]);
      keys2.push(...diacriticMarks[char]);
    } else {
      keys1.push(char);
      keys2.push(char);
    }
  }
  
  if (toneMark) {
    keys2.push(toneMark);
  }
  
  const puncKeys = puncPart ? puncPart.split('') : [];
  keys1.push(...puncKeys);
  keys2.push(...puncKeys);
  
  if (!toneMark) {
    return [keys1];
  }
  
  return [keys1, keys2];
}

export function validateInput(targetText: string, inputText: string, method: InputMethod): ValidationResult {
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  let isValid = true;
  let errorWordIndex = -1;
  let firstErrorIndex = -1;
  let correctKeysCount = 0;
  
  for (let i = 0; i < inputWords.length; i++) {
    const inputWord = inputWords[i];
    const targetWord = targetWords[i];
    
    if (targetWord === undefined) {
      isValid = false;
      errorWordIndex = i;
      firstErrorIndex = correctKeysCount > 0 ? correctKeysCount - 1 : 0;
      correctKeysCount = firstErrorIndex;
      break;
    }
    
    const possibleKeysList = getPossibleKeys(targetWord, method);
    const inputKeys = wordToKeys(inputWord, method);
    
    if (i < inputWords.length - 1) {
      const matchingKeys = possibleKeysList.find(keys => arraysEqual(inputKeys, keys));
      
      if (!matchingKeys) {
        isValid = false;
        errorWordIndex = i;
        const matchLen = getLongestCommonPrefixLength(possibleKeysList, inputKeys);
        firstErrorIndex = correctKeysCount + matchLen;
        correctKeysCount += matchLen;
        break;
      }
      correctKeysCount += matchingKeys.length + 1; // cộng 1 khoảng trắng
    } else {
      const matchingKeys = possibleKeysList.find(keys => startsWithArray(keys, inputKeys));
      
      if (!matchingKeys) {
        isValid = false;
        errorWordIndex = i;
        const matchLen = getLongestCommonPrefixLength(possibleKeysList, inputKeys);
        firstErrorIndex = correctKeysCount + matchLen;
        correctKeysCount += matchLen;
        break;
      }
      correctKeysCount += inputKeys.length;
    }
  }
  
  return {
    isValid,
    errorWordIndex,
    firstErrorIndex,
    currentProgressIndex: correctKeysCount
  };
}

function getLongestCommonPrefixLength(possibleKeysList: string[][], inputKeys: string[]): number {
  let maxLength = 0;
  for (const keys of possibleKeysList) {
    let length = 0;
    const minLen = Math.min(keys.length, inputKeys.length);
    for (let i = 0; i < minLen; i++) {
      if (keys[i] === inputKeys[i]) {
        length++;
      } else {
        break;
      }
    }
    if (length > maxLength) {
      maxLength = length;
    }
  }
  return maxLength;
}

export function getNextHighlightKey(targetText: string, inputText: string, method: InputMethod): string | null {
  const { isValid } = validateInput(targetText, inputText, method);
  
  if (!isValid) {
    return '⌫';
  }
  
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  const lastInputWordIndex = inputWords.length - 1;
  const targetWord = targetWords[lastInputWordIndex];
  
  if (!targetWord) return null;
  
  const inputWord = inputWords[lastInputWordIndex];
  const possibleKeysList = getPossibleKeys(targetWord, method);
  const inputKeys = wordToKeys(inputWord, method);
  
  const matchingKeys = possibleKeysList.find(keys => startsWithArray(keys, inputKeys)) || possibleKeysList[0];
  
  if (inputKeys.length < matchingKeys.length) {
    return matchingKeys[inputKeys.length];
  }
  
  if (lastInputWordIndex < targetWords.length - 1) {
    return ' ';
  }
  
  return null;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function startsWithArray(target: string[], prefix: string[]): boolean {
  if (prefix.length > target.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== target[i]) return false;
  }
  return true;
}

export function getPossiblePaths(word: string, method: InputMethod): PossiblePath[] {
  if (!word) return [{ keys: [], charToKeyIndices: {} }];
  
  const normalizedWord = word.normalize('NFC');
  const match = normalizedWord.match(/^([\p{L}]+)([^\p{L}]*)$/u);
  
  if (!match) {
    const keys = normalizedWord.split('');
    const charToKeyIndices: Record<number, number[]> = {};
    keys.forEach((_, idx) => {
      charToKeyIndices[idx] = [idx];
    });
    return [{ keys, charToKeyIndices }];
  }
  
  const alphaPart = match[1];
  const puncPart = match[2];
  
  const { toneMarks, diacriticMarks } = getMaps(method);

  // Sinh Path 1: Dấu ngay sau nguyên âm
  const keys1: string[] = [];
  const charToKeyIndices1: Record<number, number[]> = {};
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    const startIndex = keys1.length;
    
    if (toneMarks[char]) {
      const toneMark = toneMarks[char].mark;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys1.push(...diacriticMarks[cleanChar]);
      } else {
        keys1.push(cleanChar);
      }
      keys1.push(toneMark);
    } else if (diacriticMarks[char]) {
      keys1.push(...diacriticMarks[char]);
    } else {
      keys1.push(char);
    }
    
    const endIndex = keys1.length;
    const indices: number[] = [];
    for (let k = startIndex; k < endIndex; k++) {
      indices.push(k);
    }
    charToKeyIndices1[i] = indices;
  }
  
  // Sinh Path 2: Dấu ở cuối phần chữ cái
  const keys2: string[] = [];
  const charToKeyIndices2: Record<number, number[]> = {};
  let toneMark: string | null = null;
  let toneMarkCharIndex = -1;
  
  for (let i = 0; i < alphaPart.length; i++) {
    const char = alphaPart[i];
    const startIndex = keys2.length;
    
    if (toneMarks[char]) {
      toneMark = toneMarks[char].mark;
      toneMarkCharIndex = i;
      const cleanChar = toneMarks[char].char;
      if (diacriticMarks[cleanChar]) {
        keys2.push(...diacriticMarks[cleanChar]);
      } else {
        keys2.push(cleanChar);
      }
    } else if (diacriticMarks[char]) {
      keys2.push(...diacriticMarks[char]);
    } else {
      keys2.push(char);
    }
    
    const endIndex = keys2.length;
    const indices: number[] = [];
    for (let k = startIndex; k < endIndex; k++) {
      indices.push(k);
    }
    charToKeyIndices2[i] = indices;
  }
  
  if (toneMark && toneMarkCharIndex !== -1) {
    const toneMarkIndex = keys2.length;
    keys2.push(toneMark);
    charToKeyIndices2[toneMarkCharIndex].push(toneMarkIndex);
  }
  
  // Thêm phần dấu câu vào cuối
  const puncKeys = puncPart ? puncPart.split('') : [];
  if (puncKeys.length > 0) {
    const startIdx1 = keys1.length;
    keys1.push(...puncKeys);
    puncKeys.forEach((_, idx) => {
      charToKeyIndices1[alphaPart.length + idx] = [startIdx1 + idx];
    });
    
    const startIdx2 = keys2.length;
    keys2.push(...puncKeys);
    puncKeys.forEach((_, idx) => {
      charToKeyIndices2[alphaPart.length + idx] = [startIdx2 + idx];
    });
  }
  
  if (!toneMark) {
    return [{ keys: keys1, charToKeyIndices: charToKeyIndices1 }];
  }
  
  return [
    { keys: keys1, charToKeyIndices: charToKeyIndices1 },
    { keys: keys2, charToKeyIndices: charToKeyIndices2 }
  ];
}

export function getCharColorStates(targetText: string, inputText: string, method: InputMethod): ('correct' | 'incorrect' | 'current' | 'none')[] {
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedInput = inputText.normalize('NFC');
  
  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  
  const { isValid, errorWordIndex } = validateInput(targetText, inputText, method);
  
  const states: ('correct' | 'incorrect' | 'current' | 'none')[] = [];
  
  for (let w = 0; w < targetWords.length; w++) {
    const targetWord = targetWords[w];
    const inputWord = inputWords[w];
    
    // Thêm khoảng trắng trước từ
    if (w > 0) {
      let spaceState: 'correct' | 'incorrect' | 'current' | 'none' = 'none';
      
      if (errorWordIndex !== -1 && w - 1 >= errorWordIndex) {
        if (w - 1 === errorWordIndex && inputWords.length > w && inputWords[w - 1] !== undefined) {
          spaceState = 'incorrect';
        } else {
          spaceState = 'none';
        }
      } else {
        if (w < inputWords.length) {
          spaceState = 'correct';
        } else if (w === inputWords.length && isValid) {
          // Chỉ gán current cho dấu cách nếu từ ngay trước đó đã được hoàn thành
          const prevWord = targetWords[w - 1];
          const prevInput = inputWords[w - 1];
          if (prevInput !== undefined) {
            const prevPossible = getPossibleKeys(prevWord, method);
            const prevInputKeys = wordToKeys(prevInput, method);
            const isPrevComplete = prevPossible.some(keys => arraysEqual(prevInputKeys, keys));
            if (isPrevComplete) {
              spaceState = 'current';
            }
          }
        }
      }
      states.push(spaceState);
    }
    
    const possiblePaths = getPossiblePaths(targetWord, method);
    
    if (inputWord === undefined) {
      for (let c = 0; c < targetWord.length; c++) {
        states.push('none');
      }
    } else if (errorWordIndex !== -1 && w === errorWordIndex) {
      const inputKeys = wordToKeys(inputWord, method);
      
      let bestPath = possiblePaths[0];
      let maxMatchLen = 0;
      
      for (const path of possiblePaths) {
        let matchLen = 0;
        const minLen = Math.min(path.keys.length, inputKeys.length);
        for (let k = 0; k < minLen; k++) {
          if (path.keys[k] === inputKeys[k]) {
            matchLen++;
          } else {
            break;
          }
        }
        if (matchLen > maxMatchLen) {
          maxMatchLen = matchLen;
          bestPath = path;
        }
      }
      
      let stopCorrect = false;
      let hasIncorrectSet = false;
      
      for (let c = 0; c < targetWord.length; c++) {
        const keyIndices = bestPath.charToKeyIndices[c] || [];
        const isAllKeysCorrect = keyIndices.length > 0 && keyIndices.every(idx => idx < maxMatchLen);
        
        if (isAllKeysCorrect && !stopCorrect) {
          states.push('correct');
        } else {
          stopCorrect = true;
          const isErrorChar = keyIndices.includes(maxMatchLen);
          
          if (isErrorChar && !hasIncorrectSet) {
            states.push('incorrect');
            hasIncorrectSet = true;
          } else {
            states.push('none');
          }
        }
      }
    } else if (errorWordIndex !== -1 && w > errorWordIndex) {
      for (let c = 0; c < targetWord.length; c++) {
        states.push('none');
      }
    } else {
      const inputKeys = wordToKeys(inputWord, method);
      const isLastWord = w === inputWords.length - 1;
      
      let bestPath = possiblePaths[0];
      if (isLastWord) {
        bestPath = possiblePaths.find(path => startsWithArray(path.keys, inputKeys)) || possiblePaths[0];
      } else {
        bestPath = possiblePaths.find(path => arraysEqual(path.keys, inputKeys)) || possiblePaths[0];
      }
      
      let stopCorrect = false;
      let hasCurrentSet = false;
      
      for (let c = 0; c < targetWord.length; c++) {
        const keyIndices = bestPath.charToKeyIndices[c] || [];
        const isAllKeysCorrect = keyIndices.length > 0 && keyIndices.every(idx => idx < inputKeys.length);
        
        if (isAllKeysCorrect && !stopCorrect) {
          states.push('correct');
        } else {
          stopCorrect = true;
          if (isLastWord && !hasCurrentSet && (states.length === 0 || states[states.length - 1] === 'correct')) {
            states.push('current');
            hasCurrentSet = true;
          } else {
            states.push('none');
          }
        }
      }
    }
  }
  
  return states;
}
