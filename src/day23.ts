import {getInput, getTestFunction} from './helper';

const DAY = 23;

type Input = [string, string][];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  const map: Record<string, Set<string>> = {};

  for (const [a, b] of input) {
    map[a] ??= new Set();
    map[b] ??= new Set();
    map[a].add(b);
    map[b].add(a);
  }

  const resultSet = new Set();

  for (const a in map) {
    if (!a.startsWith('t')) {
      continue;
    }
    for (const b of map[a]) {
      for (const c of map[a]) {
        if (b == c) {
          continue
        }
        if (map[b].has(c)) {
          const resulArray = [a, b, c];
          resulArray.sort();
          resultSet.add(resulArray.join(','));
        }
      }
    }
  }
  return resultSet.size;
}

function calculatePart2(input: Input) {
  const map: Record<string, Set<string>> = {};

  for (const [a, b] of input) {
    map[a] ??= new Set();
    map[b] ??= new Set();
    map[a].add(b);
    map[b].add(a);
  }

  for (const a in map) {
    loop: for (const x of map[a]) {
      for (const b of map[a]) {
        for (const c of map[a]) {
          if (b == c || b == x || c == x) {
            continue
          }
          if (!map[b].has(c)) {
            continue loop;
          }
        }
      }
      map[a].delete(x);
      const arr = Array.from(map[a]);
      arr.push(a);
      arr.sort();
      return arr.join(',');
    }
  }
  return '----';
}

function parse(input: string): Input {
  return input.split('\n').map(r => r.split('-') as [string, string]);
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
  const input = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`
  part1Test(input, 7);

  console.log('---------------------');

  part2Test(input, 'co,de,ka,ta');

  console.log('---------------------');
}
