import {getInput, getTestFunction} from './helper';
import {Pos, PosSet} from './utils';

const DAY = 14;

class Robot {
  constructor(public pos: Pos, public readonly speed: Pos) {
  }

  move(size: Pos) {
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
    if (this.pos.x < 0) {
      this.pos.x += size.x;
    }
    if (this.pos.x >= size.x) {
      this.pos.x -= size.x;
    }
    if (this.pos.y < 0) {
      this.pos.y += size.y;
    }
    if (this.pos.y >= size.y) {
      this.pos.y -= size.y;
    }
  }

  getQuadrant(size: Pos): number | null {
    const xh =  Math.floor(size.x / 2);
    const yh =  Math.floor(size.y / 2);
    if (this.pos.x < xh && this.pos.y < yh) {
      return 0
    }
    if (this.pos.x > xh && this.pos.y < yh) {
      return 1
    }
    if (this.pos.x < xh && this.pos.y > yh) {
      return 2
    }
    if (this.pos.x > xh && this.pos.y > yh) {
      return 3
    }
    return null;
  }
}

type Input = Robot[];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input, size: Pos = new Pos(101, 103)) {
  const quadrants = [0, 0, 0, 0];
  for (const robot of input) {
    for (let i = 0; i < 100; i++) {
      robot.move(size)
    }
    const q = robot.getQuadrant(size);
    if (q != null) {
      quadrants[q]++
    }
  }
  return quadrants.reduce((a, b) => a * b);
}

function calculatePart2(input: Input, size: Pos = new Pos(101, 103)) {
  let result = 0;
  while (true) {
    result++;
    for (const robot of input) {
      robot.move(size);
    }
    const posSet = new PosSet();
    input.forEach(r => posSet.add(r.pos));
    if (input.length == posSet.size) {
      log(input, size);
      break;
    }
  }
  return result;
}

function log(robots: Robot[], size: Pos) {
  let map = new Array(size.y).fill('').map(_ => new Array(size.x).fill(' '));
  for (const robot of robots) {
    map[robot.pos.y][robot.pos.x] = '*'
  }
  console.log(map.map(r => r.join('')).join('\n'));
}


function parse(input: string): Input {
  return input.split('\n').map(r => {
    const res = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/.exec(r);
    if (!res) {
      throw new Error('Invalid input');
    }
    return new Robot(new Pos(+res[1], +res[2]), new Pos(+res[3], +res[4]))
  });
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input), new Pos(11, 7)));
  const input = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`
  part1Test(input, 12);

  console.log('---------------------');
}




