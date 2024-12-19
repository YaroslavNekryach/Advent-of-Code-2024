import {getInput, getTestFunction} from './helper';

const DAY = 19;

type Input = { patterns: string[], designs: string[] };

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  for (const design of input.designs) {
    if (patternCount(input.patterns, design) > 0) {
      result++;
    }
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  for (const design of input.designs) {
    result += patternCount(input.patterns, design);
  }
  return result;
}

function patternCount(patterns: string[], design: string, cache: Record<string, number> = {}): number {
  if (design === '') {
    return 1;
  }
  if (cache[design] != null) {
    return cache[design];
  }
  let count = 0;
  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      count += patternCount(patterns, design.slice(pattern.length), cache);
    }
  }
  cache[design] = count;
  return count;
}

function parse(input: string): Input {
  const [patternsStr, designsStr] = input.split('\n\n');
  const patterns = patternsStr.split(', ');
  const designs = designsStr.split('\n');
  return {patterns, designs}
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
  const input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`
  part1Test(input, 6);

  console.log('---------------------');

  part2Test(input, 16);

  console.log('---------------------');
}
