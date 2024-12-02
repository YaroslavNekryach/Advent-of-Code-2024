import {getInput, getTestFunction} from './helper';

const DAY = 2;

type Input = number[][];

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  for (const r of input) {
   if (isCorrect(r) === true)
    result++;
  }
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  for (const r of input) {
    const res = isCorrect(r);
    if (res === true) {
      result++;
    } else {
      const r1 = r.slice()
      r1.splice(res[0], 1);
      const r2 = r.slice()
      r2.splice(res[1], 1);
      if (isCorrect(r1) === true || isCorrect(r2) === true) {
        result++;
      }
    }
  }
  return result;
}

function isCorrect(r: number[]): true | [number, number] {
  const p = isUp(r);
  for (let i = 1; i < r.length; i++) {
    let d = r[i] - r[i - 1];
    if (Math.abs(d) > 3 || Math.abs(d) < 1 || p !== d > 0) {
      return [i, i - 1];
    }
  }
  return true
}

function isUp(r: number[]){
  let up = 0;
  let down = 0;
  for (let i = 1; i < r.length; i++) {
    let d = r[i] - r[i - 1];
    if (d > 0) {
      up++
    } else if (d < 0 ){
      down++
    }
  }
  return up > down;
}


function parse(input: string): Input {

  return input.split('\n').map(r => r.split(' ').map(v => +v));
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
  const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`
  part1Test(input, 2);

  console.log('---------------------');

  part2Test(input, 4);

  console.log('---------------------');
}
