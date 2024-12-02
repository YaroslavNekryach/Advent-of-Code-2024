import {getInput, getTestFunction} from './helper';

const DAY = 1;

type Input = [number[], number[]];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  const [arr1, arr2] = input;
  arr1.sort((a, b) => a - b);
  arr2.sort((a, b) => a - b);
  for (let i = 0; i < arr1.length; i++) {
    result += Math.abs(arr2[i] - arr1[i]);
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0
  const [list, check] = input;
  const countMap = new Map<number, number>();
  for (let v of check) {
    const c = countMap.get(v)
    if (c != null) {
      countMap.set(v, c + 1);
    } else {
      countMap.set(v, 1);
    }
  }

  for (let v of list) {
    result += v * (countMap.get(v) || 0);
  }
  return result;
}


function parse(input: string): Input {
  const arr1: number[] = [];
  const arr2: number[] = [];
  input.split('\n').map(r => {
    const res = /^(\d+)\s+(\d+)$/.exec(r);
    if (!res) {
      throw new Error('Invalid input');
    }
    arr1.push(+res[1])
    arr2.push(+res[2])
  });
  return [arr1, arr2];
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
  const input = `3   4
4   3
2   5
1   3
3   9
3   3`
  part1Test(input, 11);

  console.log('---------------------');

  part2Test(input, 31);

  console.log('---------------------');
}
