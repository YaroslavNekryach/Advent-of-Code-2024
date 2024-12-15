import {getInput, getTestFunction} from './helper';
import {clearConsole, Map, Pos, sleep} from './utils';

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

// tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function move(map: Map<string>, pos: Pos, dir: Pos): boolean {
  const v = map.get(pos)!;
  if (v === EMPTY) {
    return true
  }
  if (v === WALL) {
    return false
  }
  if (move(map, pos.add(dir), dir)) {
    map.set(pos, EMPTY);
    map.set(pos.add(dir), v);
    return true
  }
  return false;
}

function canMove(map: Map<string>, pos: Pos, dir: Pos): boolean {
  const v = map.get(pos)!;
  if (v === EMPTY) {
    return true
  }
  if (v === WALL) {
    return false
  }
  if ((dir.eq(Pos.UP) || dir.eq(Pos.DOWN))) {
    if (v === BOX_L) {
      return canMove(map, pos.add(dir), dir) && canMove(map, pos.add(Pos.RIGHT).add(dir), dir);
    }
    if (v === BOX_R) {
      return canMove(map, pos.add(dir), dir) && canMove(map, pos.add(Pos.LEFT).add(dir), dir);
    }
  }

  return move(map, pos.add(dir), dir);
}


function move2(map: Map<string>, pos: Pos, dir: Pos, b = false): boolean {
  const v = map.get(pos)!;
  if (v === EMPTY) {
    return true
  }
  if (v === WALL) {
    return false
  }
  if ((v === BOX_L || v === BOX_R) && (dir.eq(Pos.UP) || dir.eq(Pos.DOWN))) {
    if (canMove(map, pos, dir)) {
      let opSymbol = BOX_R;
      let opPos = pos.add(Pos.RIGHT);
      if (v === BOX_R) {
        opSymbol = BOX_L;
        opPos = pos.add(Pos.LEFT);
      }
        move2(map, pos.add(dir), dir);
        move2(map, opPos.add(dir), dir);
        map.set(pos, EMPTY);
        map.set(opPos, EMPTY);
        map.set(pos.add(dir), v);
        map.set(opPos.add(dir), opSymbol);

      return true;
    } else {
      return false
    }
  } else if (move2(map, pos.add(dir), dir)) {
    map.set(pos, EMPTY);
    map.set(pos.add(dir), v);
    return true
  }
  return false;
}

function calculatePart1({map, moves}: Input) {
  let result = 0;
  const robotPos: Pos = findRobotPos(map);
  for (const m of moves) {
    const dir = MOVES[m];
    if (move(map, robotPos, dir)) {
      robotPos.addMut(dir);
    }
  }
  for (const [pos, value] of map) {
    if (value === BOX) {
      result += pos.x + pos.y * 100;
    }
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  const map = resizeMap(input.map);
  const robotPos: Pos = findRobotPos(map);
  for (const m of input.moves) {
    const dir = MOVES[m];
    if (move2(map, robotPos, dir)) {
      robotPos.addMut(dir);
    }
    // clearConsole();
    // map.log();
    // await sleep(20);
  }
  for (const [pos, value] of map) {
    if (value === BOX_L) {
      result += pos.x + pos.y * 100;
    }
  }
  return result;
}

function findRobotPos(map: Map<string>): Pos {
  for (const [pos, value] of map) {
    if (value === ROBOT) {
      return pos;
    }
  }
  throw new Error('Robot not found');
}

function resizeMap(map: Map<string>): Map<string> {
  return new Map(map.map.map(l => l.flatMap(v => {
    switch (v) {
      case BOX:
        return [BOX_L, BOX_R]
      case ROBOT:
        return [ROBOT, EMPTY]
      default:
        return [v, v]
    }
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
