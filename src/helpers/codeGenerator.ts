import Calculator from './Calculator.js';
import shuffle from './shuffle.js';

/** @public */
export type CodeGeneratorInput = {
  length?: number
  alphanumeric?: boolean
  entropy?: 1 | 2
}

const alpha = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const numeric = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Generate a random code
 * @param input - Your input
 * @returns
 *
 * @public
 */
const codeGenerator = (
  input?: CodeGeneratorInput,
) => {
  const { length = 4, alphanumeric = false, entropy = 2 } = input || {};
  const allChars = alphanumeric ? [...alpha, ...numeric] : [...numeric];
  const chars = shuffle(allChars).slice(
    0,
    Calculator.round(length / entropy, 0),
  );

  let code = '';
  for (let i = 0; i < length; i += 1) {
    code = `${code}${shuffle(chars)[0]}`;
  }

  return code;
};

export default codeGenerator;
