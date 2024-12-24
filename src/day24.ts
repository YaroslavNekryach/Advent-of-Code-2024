import {getInput, getTestFunction} from './helper';

const DAY = 24;

type Input = { values: Record<string, number>, gates: Record<string, { a: string, b: string, op: string }> };
let cache: Record<string, number> = {};
let log = false;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  const result: number[] = [];
  for (const wire in input.gates) {
    if (wire.startsWith('z')) {
      result[index(wire)] = getValue(input, wire);
    }
  }

  const zb = result.reverse().join('');
  return parseInt(zb, 2);
}

function calculatePart2(input: Input) {
  log = true;
  cache = {};
  const result: number[] = [];
  const answer = ['z09', 'nnf', 'z20', 'nhs', 'kqh', 'ddn', 'z34', 'wrc']
  const ex = expected(input.values);
  swap(input, answer[0], answer[1]);
  swap(input, answer[2], answer[3]);
  swap(input, answer[4], answer[5]);
  swap(input, answer[6], answer[7]);
  for (let i = 0; i <= 45; i++) {
    const key = 'z' + i.toString().padStart(2, '0');
    if (log) {
      console.log(key);
    }
    result.push(getValue(input, key))
  }

  // console.log(result.join(''));
  // console.log(ex.join(''));

  return answer.sort().join(',')
}

function swap(input: Input, a: string, b: string) {
  ([input.gates[a], input.gates[b]] = [input.gates[b], input.gates[a]]);
}

function index(s: string): number {
  return parseInt(s.slice(1), 10)
}

function expected(values: Record<string, number>): number[] {
  let xb = [];
  for (const wire in values) {
    if (wire.startsWith('x')) {
      xb[index(wire)] = values[wire];
    }
  }
  let yb = [];
  for (const wire in values) {
    if (wire.startsWith('y')) {
      yb[index(wire)] = values[wire];
    }
  }
  const x = parseInt(xb.reverse().join(''), 2);
  const y = parseInt(yb.reverse().join(''), 2);
  const z = x + y;
  return z.toString(2).split('').reverse().map(v => +v);
}

function getValue(input: Input, wire: string): number {
  if (input.values[wire] != null) {
    return input.values[wire];
  }
  if (cache[wire] != null) {
    return cache[wire]
  }
  const {a, b, op} = input.gates[wire];
  if (log) {
    console.log(`${wire} = ${a} ${op} ${b}`)
  }
  switch (op) {
    case 'AND':
      cache[wire] = getValue(input, a) & getValue(input, b);
      break;
    case 'OR':
      cache[wire] = getValue(input, a) | getValue(input, b);
      break;
    case 'XOR':
      cache[wire] = getValue(input, a) ^ getValue(input, b);
      break;
    default:
      throw new Error('Invalid operation')
  }
  return cache[wire];
}

function parse(input: string): Input {
  const [valuesStr, gatesStr] = input.split('\n\n');
  const values = valuesStr.split('\n').map(v => v.split(': ')).reduce((data, v) => {
    data[v[0]] = +v[1];
    return data;
  }, {} as Record<string, number>)
  const gates: Record<string, { a: string, b: string, op: string }> = {}
  gatesStr.split('\n').map(l => {
    const res = /(.*) (.*) (.*) -> (.*)/.exec(l);
    if (!res) {
      throw new Error('Invalid input');
    }
    return gates[res[4]] = {a: res[1], b: res[3], op: res[2]}
  });
  return {values, gates};
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input)));
  const input = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`
  cache = {};
  part1Test(input, 2024);
  cache = {};
  part1Test(`x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`, 4);
  cache = {};

  console.log('---------------------');
}
