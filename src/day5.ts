import {getInput, getTestFunction} from './helper';

const DAY = 5;

type Input = {rules: Record<number, Set<number>>, pages: number[][]};

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  for (const page of input.pages) {
    const sortedPage = sort(page, input.rules);
    if (eq(page, sortedPage)) {
      result += mid(sortedPage);
    }
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  for (const page of input.pages) {
    const sortedPage = sort(page, input.rules);
    if (!eq(page, sortedPage)) {
      result += mid(sortedPage);
    }
  }
  return result;
}

function sort(arr: number[], rules: Record<number, Set<number>>): number[] {
  return arr.slice().sort((a, b) => rules[a]?.has(b) ? -1 : 1);
}

function mid(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)];
}

function eq(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function parse(input: string): Input {
  const [rules, pages] = input.split('\n\n');
  const m: Record<number, Set<number>> = {};
  rules.split('\n').map(l => l.split('|').map(v => +v))
    .forEach(([l ,r]) => m[l] ? m[l].add(r) : m[l] = new Set([r]));
  return {
    rules: m,
    pages: pages.split('\n').map(l => l.split(',').map(v => +v))
  }
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
  const input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;
  part1Test(input, 143);

  console.log('---------------------');

  part2Test(input, 123);

  console.log('---------------------');
}
