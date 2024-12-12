import {getInput, getTestFunction} from './helper';
import {Map, Pos, PosSet} from './utils'
const DAY = 12;

type Input = Map<string>;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});


function calculatePart1(input: Input) {
  let result = 0;
  for (const [pos, v] of input) {
    if (!v) {
      continue
    }
    const shape = findShape(input, pos);
    let per = 0;
    for (const reg of shape.values()) {
      per += perimeter(input, reg);
    }
    result += per * shape.size;
    for (const p of shape.values()) {
      input.set(p, '');
    }
  }
  return result;
}


function calculatePart2(input: Input) {
  let result = 0;
  for (const [pos, v] of input) {
    if (!v) {
      continue
    }
    const shape = findShape(input, pos);
    let s = 0;
    for (const reg of shape.values()) {
      s += sides(input, reg);
    }
    result += s * shape.size;
    for (const p of shape.values()) {
      input.set(p, '');
    }
  }
  return result;
}


function findShape(input: Input, start: Pos, found: PosSet = new PosSet()) {
  const v = input.get(start)!;
  found.add(start)
  for (const n of start.getNear4()) {
    if (input.get(n) === v && !found.has(n)) {
        findShape(input, n, found);
    }
  }
  return found;
}

function perimeter(input: Input, pos: Pos): number {
  const v = input.get(pos)!;
  return pos.getNear4().filter(n => input.get(n) !== v).length;
}

function sides(input: Input, pos: Pos): number {
  let n = 0;
  const v = input.get(pos)!;
  if (input.get(pos.up()) !== v && input.get(pos.left()) !== v) {
    n++
  }
  if (input.get(pos.left()) !== v && input.get(pos.down()) !== v) {
    n++
  }
  if (input.get(pos.down()) !== v && input.get(pos.right()) !== v) {
    n++
  }
  if (input.get(pos.right()) !== v && input.get(pos.up()) !== v) {
    n++
  }
  if (input.get(pos.up()) === v && input.get(pos.left()) === v && input.get(pos.up().left()) !== v) {
    n++
  }
  if (input.get(pos.left()) === v && input.get(pos.down()) === v && input.get(pos.down().left()) !== v) {
    n++
  }
  if (input.get(pos.down()) === v && input.get(pos.right()) === v && input.get(pos.down().right()) !== v) {
    n++
  }
  if (input.get(pos.right()) === v && input.get(pos.up()) === v && input.get(pos.up().right()) !== v) {
    n++
  }
  return n;
}

function parse(input: string): Input {
  return new Map(input.split('\n').map(l => l.split('')));
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
  const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
  part1Test(input, 1930);
  part1Test(`AAAA
BBCD
BBCC
EEEC`, 140);
  part1Test(`OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`, 772);
  console.log('---------------------');

  part2Test(input, 1206);
  part2Test(`AAAA
BBCD
BBCC
EEEC`, 80);
  part2Test(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`, 236);
  part2Test(`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`, 368);
  part2Test(`AAAAAAAA
AACBBDDA
AACBBAAA
ABBAAAAA
ABBADDDA
AAAADADA
AAAAAAAA`, 946);
  console.log('---------------------');
}
