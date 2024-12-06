import {getInput, getTestFunction} from './helper';

const DAY = 6;
type Pos = [number, number];
const Dir = [[0, -1], [1, 0], [0, 1], [-1, 0]];
type Input = {map: string[][], pos: [number, number];};

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1({pos, map}: Input) {
  let result = 0;
  let dir = 0;
  while (map[pos[1]]?.[pos[0]]) {
    if (map[pos[1]][pos[0]] === '.') {
      result++;
      map[pos[1]][pos[0]] = 'X';
    }
    while (true) {
      if (map[pos[1] + Dir[dir % 4][1]]?.[pos[0] + Dir[dir % 4][0]] === '#') {
        dir++
      } else {
        break
      }
    }
    pos[0] += Dir[dir % 4][0];
    pos[1] += Dir[dir % 4][1];
  }
  return result;
}

function calculatePart2({pos, map}: Input) {
  let result = 0;
  const s: Pos = JSON.parse(JSON.stringify(pos));
  calculatePart1({pos: s, map});
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== 'X') {
        continue;
      }
      const m: string[][] = JSON.parse(JSON.stringify(map));
      const p: Pos = JSON.parse(JSON.stringify(pos));
      if (pos[0] === x && pos[1] === y) {
        continue;
      }
      m[y][x] = '#'
      if (isLoop(m, p)) {
        result++;
      }
    }
  }
  return result;
}

function isLoop(map: string[][], pos: Pos): boolean {

  let dir = 0;
  while (map[pos[1]]?.[pos[0]]) {
    const v = map[pos[1]]?.[pos[0]];
    const d = 1 << (dir % 4);
    if (+v) {
      if (+v & d) {
        return true
      } else {
        map[pos[1]][pos[0]] = (+v | d).toString(16)
      }
    } else {
      map[pos[1]][pos[0]] = d.toString(16)
    }
    while (true) {
      if (map[pos[1] + Dir[dir % 4][1]]?.[pos[0] + Dir[dir % 4][0]] === '#') {
        dir++
      } else {
        break
      }
    }
    pos[0] += Dir[dir % 4][0];
    pos[1] += Dir[dir % 4][1];
  }
  return false;
}

function parse(input: string): Input {
  const pos: Pos = [0, 0];
  const map = input.split('\n').map((l, y) => l.split('').map((v, x) => {
    if (v === '^') {
      pos[0] = x;
      pos[1] = y;
      return '.';
    } else {
      return v;
    }
  }));

  return {map, pos}
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
  const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
  part1Test(input, 41);

  console.log('---------------------');

  part2Test(input, 6);

  console.log('---------------------');
}
