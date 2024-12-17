import {getInput, getTestFunction} from './helper';

const DAY = 17;

type Input = { a: bigint, b: bigint, c: bigint, program: number[] };

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  return calculate(input).join(',');
}

function calculatePart2({b, c, program}: Input) {

  let queue = ['1', '2', '3', '4', '5', '6', '7'];
  while (queue.length > 0 && queue[0].length < program.length) {
    const newQueue: string[] = [];
    for (const q of queue) {
      for (let i = 0; i < 8; i++) {
        const n = q + i.toString();
        const a = BigInt('0o' + n.padEnd(program.length, '0'));
        const out = calculate({a, b, c, program});
        let same = true;
        for (let i = 1; i <= n.length; i++) {
          const ii = program.length - i;
          if (program[ii] !== Number(out[ii])) {
            same = false;
            break;
          }
        }
        if (same) {
          newQueue.push(n);
        }
      }
    }
    queue = newQueue;
  }
  return Math.min(...queue.map(v => parseInt(v, 8)))
}

function calculate({a, b, c, program}: Input): bigint[] {
  const out: bigint[] = [];

  let p = 0;

  while (p < program.length) {
    exec(program[p++], BigInt(program[p++]))
  }

  function exec(inst: number, op: bigint) {
    switch (inst) {
      case 0:
        a = a / (2n ** combo(op));
        break
      case 1:
        b ^= op;
        break
      case 2:
        b = combo(op) % 8n;
        break
      case 3:
        if (a != 0n) {
          p = Number(op);
        }
        break;
      case 4:
        b = b ^ c;
        break
      case 5:
        out.push(combo(op) % 8n);
        break;
      case 6:
        b = a / (2n ** combo(op));
        break
      case 7:
        c = a / (2n ** combo(op));
        break
    }
  }

  function combo(v: bigint): bigint {
    switch (v) {
      case 4n:
        return a
      case 5n:
        return b;
      case 6n:
        return c;
      default:
        return v
    }
  }

  return out;
}


function parse(input: string): Input {
  const [regs, prog] = input.split('\n\n');
  const [a, b, c] = regs.split('\n').map(v => BigInt(v.split(': ')[1]));
  const program = (prog.split(': ')[1]).split(',').map(v => +v);
  return {a, b, c, program};
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const part1TestIn = getTestFunction((input) => calculatePart1(input));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input)));
  part1Test(`Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`, '4,6,3,5,6,3,5,2,1,0');
  part1TestIn({a: 0n, b: 0n, c: 9n, program: [2, 6]}, '')
  part1TestIn({a: 10n, b: 0n, c: 0n, program: [5,0,5,1,5,4]}, '0,1,2')
  part1TestIn({a: 2024n, b: 0n, c: 0n, program: [0,1,5,4,3,0]}, '4,2,5,6,7,7,7,7,3,1,0')
  part1TestIn({a: 0n, b: 29n, c: 0n, program: [1,7]}, '')
  part1TestIn({a: 0n, b: 2024n, c: 43690n, program: [4,0]}, '')


  console.log('---------------------');

  part2Test(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`, 117440);

  console.log('---------------------');
}


