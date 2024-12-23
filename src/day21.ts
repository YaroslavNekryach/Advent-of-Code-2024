import {getInput, getTestFunction} from './helper';
import {Map, Pos} from './utils';

const DAY = 21;

type Input = string[];

abstract class AbstractKeypad {
  public abstract keypad: Map<string | null>;
  private deepLengthCache: Record<string, number> = {};

  getFullPath(path: string): string[] {
    let result: string[] = [''];
    for (let i = 0; i < path.length; i++) {
      const from = i == 0 ? 'A' : path[i - 1];
      const to = path[i];
      const paths = this.getPaths(from, to);
      result = result.flatMap(v => paths.map(p => v + p + 'A'));
    }
    return result;
  }

  getFullPathLength(path: string, deep: number): number {
    let result = 0;
    for (let i = 0; i < path.length; i++) {
      const from = i == 0 ? 'A' : path[i - 1];
      const to = path[i];
      result += this.getPathLength(from, to, deep);
    }
    return result
  }


  getPathLength(from: string, to: string, deep: number): number {
    if (deep === 0) {
      return 1
    }
    if (this.deepLengthCache[from + to + deep]) {
      return this.deepLengthCache[from + to + deep];
    }
    const paths = this.getPaths(from, to);
    const result = paths.map(path => this.getFullPathLength(path + 'A', deep - 1));
    this.deepLengthCache[from + to + deep] = Math.min(...result);
    return this.deepLengthCache[from + to + deep];
  }

  getPaths(from: string, to: string): string[] {
    const posFrom = this.find(from)!;
    const posTo = this.find(to)!;

    const result: string[] = [];

    const h = (posFrom.x > posTo.x ? '<' : '>').repeat(Math.abs(posFrom.x - posTo.x));
    const v = (posFrom.y > posTo.y ? '^' : 'v').repeat(Math.abs(posFrom.y - posTo.y));

    if (this.keypad.get(posFrom.x, posTo.y)) {
      result.push(v + h)
    }
    if (h && v && this.keypad.get(posTo.x, posFrom.y)) {
      result.push(h + v)
    }

    return result
  }

  find(v: string): Pos | undefined {
    for (const [pos, value] of this.keypad) {
      if (value === v) {
        return pos;
      }
    }
  }
}

class DirectionalKeypad extends AbstractKeypad {
  public keypad: Map<string | null> = new Map([[null, '^', 'A'], ['<', 'v', '>']]);
}

class NumericKeypad extends AbstractKeypad {
  public keypad: Map<string | null> = new Map([['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], [null, '0', 'A']]);
}


tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  return calculate(input, 2);
}

function calculatePart2(input: Input) {
  return calculate(input, 25);
}

function calculate(input: Input, deep: number) {
  let result = 0;
  const num = new NumericKeypad();
  const dir = new DirectionalKeypad();
  for (const code of input) {
    let paths = num.getFullPath(code);
    let min = Infinity;
    for (const v of paths) {
      const m = dir.getFullPathLength(v, deep);
      min = Math.min(m, min)
    }
    const value = +code.replace('A', '').replace(/^0+/, '');
    result += min * value;
  }
  return result;
}


function parse(input: string): Input {

  return input.split('\n');
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
  const input = `029A
980A
179A
456A
379A`
  part1Test(input, 126384);

  console.log('---------------------');

  part2Test(input, 154115708116294);

  console.log('---------------------');
}
