import {getInput, getTestFunction} from './helper';

const DAY = 22;

type Input = bigint[];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  for (const s of input) {
    let n = s;
    for (let i = 0; i < 2000; i++) {
      n = nextSecret(n);
    }
    result += Number(n);
  }
  return result;
}

function nextSecret(s: bigint): bigint {
  let n = s * 64n;
  n ^= s;
  n %= 16777216n;
  s = n;
  n /= 32n;
  n ^= s;
  n %= 16777216n;
  s = n;
  n *= 2048n;
  n ^= s;
  return n % 16777216n;
}

function calculatePart2(input: Input) {
  const totalMap: Record<string, number> = {};
  for (const s of input) {
    let n = s;
    const userMap: Record<string, number> = {};
    const last = [];
    for (let i = 0; i < 2000; i++) {
      const p = nextSecret(n);
      last.push(Number((p % 10n) - (n % 10n)));
      n = p;
      if (last.length >= 4) {
        const key = last.join(',');
        const v = Number((n % 10n));
        userMap[key] ??= v;
        last.shift();
      }
    }
    for (const [k, v] of Object.entries(userMap)) {
      totalMap[k] ??= 0;
      totalMap[k] += v;
    }
  }


  return Math.max(...Object.values(totalMap))
}

function parse(input: string): Input {
  return input.split('\n').map(v => BigInt(v));
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const nestTest = getTestFunction((input: bigint) => nextSecret(input));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));

  part1Test(`1
10
100
2024`, 37327623);
  nestTest(123n, 15887950n);
  nestTest(15887950n, 16495136n);


  console.log('---------------------');

  part2Test(`1
2
3
2024`, 23);

  console.log('---------------------');
}
