import {getInput, getTestFunction} from './helper';
import {Pos} from './utils';

const DAY = 13;

interface Machine {
  a: Pos;
  b: Pos;
  win: Pos;
}

type Input = Machine[];

const A_COST = 3;
const B_COST = 1;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  return input.map(m => calculate(
    BigInt(m.a.x),
    BigInt(m.a.y),
    BigInt(m.b.x),
    BigInt(m.b.y),
    BigInt(m.win.x),
    BigInt(m.win.y),
  )).reduce((a, b) => a + b, 0n);
}

function calculatePart2(input: Input) {
  return input.map(m => calculate(
    BigInt(m.a.x),
    BigInt(m.a.y),
    BigInt(m.b.x),
    BigInt(m.b.y),
    BigInt(m.win.x) + 10000000000000n,
    BigInt(m.win.y) + 10000000000000n,
  )).reduce((a, b) => a + b, 0n);
}

function calculate(ax: bigint,
                   ay: bigint,
                   bx: bigint,
                   by: bigint,
                   wx: bigint,
                   wy: bigint) {
  if ((wy * bx - wx * by) % (bx * ay - by * ax) !== 0n) {
    return 0n;
  }
  const a = (wy * bx - wx * by) / (bx * ay - by * ax);

  if ((wx - a * ax) % bx !== 0n) {
    return 0n;
  }

  const b = (wx - a * ax) / bx;

  return a * BigInt(A_COST) + b * BigInt(B_COST);
}


function parse(input: string): Input {
  return input.split('\n\n').map(block => {
    const [as, bs, ws] = block.split('\n');
    const bReg = /^Button .: X\+(\d+), Y\+(\d+)$/
    const wReg = /^Prize: X=(\d+), Y=(\d+)$/
    const aRes = bReg.exec(as)
    if (!aRes) {
      throw new Error('Invalid input');
    }
    const a = new Pos(+aRes[1], +aRes[2]);
    const bRes = bReg.exec(bs)
    if (!bRes) {
      throw new Error('Invalid input');
    }
    const b = new Pos(+bRes[1], +bRes[2]);
    const wRes = wReg.exec(ws)
    if (!wRes) {
      throw new Error('Invalid input');
    }
    const win = new Pos(+wRes[1], +wRes[2]);
    return {a, b, win}
  });
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
  const input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`
  part1Test(input, 480n);

  console.log('---------------------');

  part2Test(input, 875318608908n);

  console.log('---------------------');
}
