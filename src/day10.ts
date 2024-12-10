import {getInput, getTestFunction} from './helper';
import {Map, Pos} from './utils';

const DAY = 10;

type Input = Map<number>;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});


function calculatePart1(input: Input) {
  let result = 0;
  for (const [pos, v] of input) {
    if (v === 0) {
      const ends = getEndsList(input, pos);
      const set = new Set(ends.map((p) => p.ser()));
      result += set.size;
    }
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  for (const [pos, v] of input) {
    if (v === 0) {
      const ends = getEndsList(input, pos);
      result += ends.length;
    }
  }
  return result;
}

function getEndsList(input: Input, start: Pos, list?: Pos[]): Pos[] {
  list ??= [];
  const c = input.get(start)!;
  if (c === 9) {
    list.push(start);
    return list;
  }
  for(const p of start.getNear4()) {
    const h = input.get(p);
    if (h === c + 1) {
      getEndsList(input, p, list);
    }
  }
  return list
}

function parse(input: string): Input {
  return new Map(input.split('\n').map(l => l.split('').map(v => +v)));
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
  const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
  part1Test(input, 36);
  part1Test(`0123
1234
8765
9876`, 1);
  part1Test(`...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`, 2);
  part1Test(`..90..9
...1.98
...2..7
6543456
765.987
876....
987....`, 4);
  part1Test(`10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`, 3);


  console.log('---------------------');

  part2Test(input, 81);
  console.log('---------------------');
}
