import {getInput, getTestFunction} from './helper';

const DAY = 8;

type Pos = [number, number];
type Input = { map: Record<string, Pos[]>, size: Pos };

class PosSet {
  private set = new Set<string>;

  constructor(public readonly gridSize: Pos) {
  }

  add(pos: Pos): boolean {
    if (this.isIn(pos)) {
      this.set.add(this.ser(pos));
      return true
    }
    return false
  }

  get size(): number {
    return this.set.size;
  }


  isIn(pos: Pos) {
    return pos[0] >= 0 && pos[1] >= 0 && pos[0] < this.gridSize[0] && pos[1] < this.gridSize[1]
  }

  private ser(pos: Pos): string {
    return `${pos[0]}_${pos[1]}`
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1({map, size}: Input) {
  const res = new PosSet(size)
  for (const poss of Object.values(map)) {
    for (let ai = 0; ai < poss.length - 1; ai++) {
      for (let bi = ai + 1; bi < poss.length; bi++) {
        const a = poss[ai];
        const b = poss[bi];
        res.add([2 * a[0] - b[0], 2 * a[1] - b[1]]);
        res.add([2 * b[0] - a[0], 2 * b[1] - a[1]]);
      }
    }
  }
  return res.size;
}

function calculatePart2({map, size}: Input) {
  const res = new PosSet(size)
  for (const poss of Object.values(map)) {
    for (let ai = 0; ai < poss.length - 1; ai++) {
      for (let bi = ai + 1; bi < poss.length; bi++) {
        const a = poss[ai];
        const b = poss[bi];
        const d = [a[0] - b[0], a[1] - b[1]];

        for (let i = 0; i < 100; i++) {
          const isAdded1 = res.add([a[0] - i * d[0], a[1] - i * d[1]])
          const isAdded2 = res.add([a[0] + i * d[0], a[1] + i * d[1]])
          if (!isAdded1 && !isAdded2) {
            break
          }
        }
      }
    }
  }
  return res.size;
}


function parse(input: string): Input {
  const map: Record<string, Pos[]> = {};
  const lines = input.split('\n');
  lines.map((l, y) => {
    l.split('').forEach((v, x) => {
      if (v !== '.') {
        if (!map[v]) {
          map[v] = [];
        }
        map[v].push([x, y]);
      }
    })
  });
  const size = [lines[0].length, lines.length] as Pos;
  return {map, size};
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
  const input = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
  part1Test(input, 14);
  part1Test(`..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`, 2);

  console.log('---------------------');

  part2Test(input, 34);
  part2Test(`T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`, 9);

  console.log('---------------------');
}
