import {getInput, getTestFunction} from './helper';
import {Map, Pos} from './utils';

const DAY = 20;

const WALL = '#';
const START = 'S';

type Input = Map<string>;
type VisitedMap = { [pos: string]: number }

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(map: Input, minSave: number = 100) {
  return calculate(map, 2, minSave);
}

function calculatePart2(map: Input, minSave: number = 100) {
  return calculate(map, 20, minSave);
}

function calculate(map: Input, cheat: number, minSave: number = 100) {
  let result = 0;

  const visitedMap = getVisitedMap(map);
  for (const key1 in visitedMap) {
    const v1 = visitedMap[key1];
    const pos1 = Pos.de(key1);
    for (const pos2 of pos1.getNear(cheat)) {
      const v2 = visitedMap[pos2.ser()];
      if (v2 == null) {
        continue
      }
      const dist = pos1.dist(pos2);
      if (v1 - dist - v2 >= minSave) {
        result++
      }
    }
  }
  return result;
}

function getVisitedMap(map: Input): VisitedMap {
  const startPos = findPos(map, START);

  const posArray = [startPos];
  const visitedMap: VisitedMap = {[startPos.ser()]: 0};

  while (posArray.length > 0) {
    const pos = posArray.shift()!;
    for (const near of pos.getNear4()) {
      const v = map.get(near);
      if (!v || v === WALL || visitedMap[near.ser()] != null) {
        continue
      }
      visitedMap[near.ser()] = visitedMap[pos.ser()] + 1;
      posArray.push(near);
    }
  }
  return visitedMap;
}


function findPos(map: Map<string>, s: string): Pos {
  for (const [pos, value] of map) {
    if (value === s) {
      return pos;
    }
  }
  throw new Error('Not found');
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
  const part1Test = getTestFunction((input) => calculatePart1(parse(input), 1));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input), 50));
  const input = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`
  part1Test(input, 44);

  console.log('---------------------');

  part2Test(input, 285);

  console.log('---------------------');
}
