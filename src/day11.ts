import {getInput, getTestFunction} from './helper';
import {Map, Pos} from './utils';

const DAY = 11;

type Input = number[];
const cache: Record<number, Record<number, number>> = {}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});


function calculatePart1(input: Input) {
  const times = 25;
  return input.reduce((a, b) => a + getCount(b, times), 0)
}

function calculatePart2(input: Input) {
  const times = 75;
  return input.reduce((a, b) => a + getCount(b, times), 0)
}

function getCount(stone: number, times: number): number {
  if (times === 0) {
    return 1
  }
  const cache = getCache(stone, times);
  if (cache != null) {
    return cache;
  }
  const result = blink(stone).reduce((a, b) => a + getCount(b, times - 1), 0);
  setCache(stone, times, result);
  return result;
}

function setCache(stone: number, times: number, value: number) {
  if (!cache[stone]) {
    cache[stone] = {};
  }
  cache[stone][times] = value;
}

function getCache(stone: number, times: number): number | undefined {
  return cache[stone]?.[times];
}


function blink(stone: number): number[] {
  if (stone === 0) {
    return [1]
  }
  const l = (stone + "").length
  if (l % 2 == 0) {
    const f = Math.pow(10, l / 2)
    return [Math.floor(stone / f), stone % f]
  }
  return [stone * 2024]
}

function parse(input: string): Input {
  return input.split(' ').map(v => +v);
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const input = `125 17`;
  part1Test(input, 55312);
  console.log('---------------------');
}
