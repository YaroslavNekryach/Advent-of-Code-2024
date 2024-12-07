import {getInput, getTestFunction} from './helper';

const DAY = 7;
type Input = {result: number, input: number[]}[];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(inputs: Input) {
  let result = 0;
  for (const input of inputs) {
    if (solve(input.result, input.input)) {
      result += input.result;
    }
  }
  return result;
}

function calculatePart2(inputs: Input) {
  let result = 0;
  for (const input of inputs) {
    if (solve2(input.result, input.input)) {
      result += input.result;
    }
  }
  return result;
}

function solve(result: number, input: number[]): boolean {
  if (input.length === 1) {
    return result === input[0];
  }
  const a = [input[0] + input[1], ...input.slice(2)];
  const b = [input[0] * input[1], ...input.slice(2)];
  return solve(result, a) || solve(result, b);
}

function solve2(result: number, input: number[]): boolean {
  if (input.length === 1) {
    return result === input[0];
  }
  const a = [input[0] + input[1], ...input.slice(2)];
  const b = [input[0] * input[1], ...input.slice(2)];
  const c = [+("" + input[0] + input[1]), ...input.slice(2)];
  return solve2(result, a) || solve2(result, b) || solve2(result, c);
}

function parse(input: string): Input {
  return input.split('\n').map(l => {
    const [result, input] = l.split(': ');
    return {result: +result, input: input.split(' ').map(v=> +v)}
  })
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
  const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
  part1Test(input, 3749);

  console.log('---------------------');

  part2Test(input, 11387);

  console.log('---------------------');
}
