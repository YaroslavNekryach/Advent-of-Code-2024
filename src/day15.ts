import {getInput, getTestFunction} from './helper';
import {Map, Pos, PosSet} from './utils';

const DAY = 15;

const WALL = '#';
const ROBOT = '@';
const BOX = 'O';
const EMPTY = '.';

const BOX_L = '[';
const BOX_R = ']';

type DirKey = '<' | '^' | '>' | 'v';

const MOVES: Record<DirKey, Pos> = {
  '<': Pos.LEFT,
  '^': Pos.UP,
  '>': Pos.RIGHT,
  'v': Pos.DOWN,
}

type Input = { map: Map<string>, moves: DirKey[] };

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function getMovingBoxes(map: Map<string>, pos: Pos, dir: Pos, boxes: PosSet = new PosSet()): PosSet {
  const v = map.get(pos)!;
  if (v === EMPTY) return boxes;
  if (v === WALL) throw new Error('WALL!!!');
  boxes.add(pos);
  getMovingBoxes(map, pos.add(dir), dir, boxes);
  if ((dir.eq(Pos.UP) || dir.eq(Pos.DOWN)) && (v === BOX_L || v === BOX_R)) {
    const opPos = v === BOX_R ? pos.add(Pos.LEFT) : pos.add(Pos.RIGHT);
    if (!boxes.has(opPos)) {
      getMovingBoxes(map, opPos, dir, boxes);
    }
  }
  return boxes;
}

function moveBoxes(map: Map<string>, boxes: PosSet, dir: Pos) {
  const vPoses: Record<string, PosSet> = {};
  for (const box of boxes) {
    const v = map.get(box)!;
    vPoses[v] ??= new PosSet();
    vPoses[v].add(box.add(dir));
    map.set(box, EMPTY);
  }
  for (const [v, poses] of Object.entries(vPoses)) {
    for (const pos of poses) {
      map.set(pos, v);
    }
  }
}

function calculatePart1({map, moves}: Input) {
  let robotPos: Pos = findRobotPos(map);
  for (const m of moves) {
    robotPos = tryMove(map, robotPos, MOVES[m]);
  }
  return calculateResult(map);
}

function calculatePart2(input: Input) {
  const map = resizeMap(input.map);
  return calculatePart1({map, moves: input.moves})
}

function findRobotPos(map: Map<string>): Pos {
  for (const [pos, value] of map) {
    if (value === ROBOT) {
      return pos;
    }
  }
  throw new Error('Robot not found');
}

function tryMove(map: Map<string>, pos: Pos, dir: Pos): Pos {
  try {
    const boxes = getMovingBoxes(map, pos, dir);
    moveBoxes(map, boxes, dir);
    return pos.add(dir);
  } catch (e) {
    return pos;
  }
}

function calculateResult(map: Map<string>) {
  let result = 0;
  for (const [pos, value] of map) {
    if (value === BOX || value === BOX_L) {
      result += pos.x + pos.y * 100;
    }
  }
  return result;
}

function resizeMap(map: Map<string>): Map<string> {
  return new Map(map.map.map(l => l.flatMap(v => {
    if (v === BOX) return [BOX_L, BOX_R];
    if (v === ROBOT) return [ROBOT, EMPTY];
    return [v, v]
  })))
}

function parse(input: string): Input {
  const [mapStr, movesStr] = input.split('\n\n');
  const map = new Map(mapStr.split('\n').map(l => l.split('')));
  const moves = movesStr.replace(/\s/g, '').split('') as DirKey[];
  return {map, moves};
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
  const input = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`
  const input2 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`
  part1Test(input, 10092);
  part1Test(input2, 2028);

  console.log('---------------------');
  const input3 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`

  part2Test(input, 9021);
  part2Test(input3, 618);

  console.log('---------------------');
}
