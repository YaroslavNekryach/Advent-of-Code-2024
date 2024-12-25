import {getInput, getTestFunction} from './helper';

const DAY = 25;

type Input = {locks: number[][], keys: number[][]};

tests();
run().then(([result1]) => {
  console.log('Part 1:', result1);
});

function calculatePart1(input: Input) {
  let result = 0;
  for(const lock of input.locks) {
    loop: for (const key of input.keys) {
      for (let i = 0; i < key.length; i++) {
        if (key[i] + lock[i] > 5) {
          continue loop
        }
      }
      result++;
    }
  }
  return result;
}

function parse(input: string): Input {
  const locks: number[][] = [];
  const keys: number[][] = [];

  input.split('\n\n').forEach(v => {
    const item = new Array(5).fill(0);
    v.split('\n').slice(1, -1).forEach((l, i) => l.split('').forEach((v, i) => item[i] += v === '#' ? 1 : 0));
    if (v[0] === '#') {
      locks.push(item)
    } else {
      keys.push(item)
    }
  })

  return {locks, keys}
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  return [result1]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const input = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`
  part1Test(input, 3);

  console.log('---------------------');
}
