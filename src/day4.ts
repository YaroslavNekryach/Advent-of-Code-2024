import {getInput, getTestFunction} from './helper';

const DAY = 4;

type Input = string[];

const DIR: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
]


tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      for (const d of DIR) {
        if (isXMAS(input, [y, x], d)) {
          result++;
        }
      }
    }
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      result += isMAS(input, [y, x]);
    }
  }
  return result;
}

function isXMAS(input: Input, pos: [number, number], dir: [number, number]): boolean {
  const word = 'XMAS';
  for (let i = 0; i < word.length; i++) {
    if (input[pos[0] + dir[0] * i]?.[pos[1] + dir[1] * i] !== word[i]) {
      return false;
    }
  }
  return true;
}

function isMAS(input: Input, pos: [number, number]): number {
  const patterns = [
    ['M.M', '.A.', 'S.S'],
    ['M.S', '.A.', 'M.S'],
    ['S.S', '.A.', 'M.M'],
    ['S.M', '.A.', 'S.M']
  ];
  let count = 0
  loop: for (const p of patterns) {
    for (let dx = 0; dx < 3; dx++) {
      for (let dy = 0; dy < 3; dy++) {
        if (p[dx][dy] != '.' && input[pos[0] + dx]?.[pos[1] + dy] !== p[dx][dy]) {
          continue loop;
        }
      }
    }
    count++
  }
  return count;
}


function parse(input: string): Input {
  return input.split('\n');
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));
  const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  part1Test(input, 18);

  console.log('---------------------');

  part2Test(input, 9);

  console.log('---------------------');
}
