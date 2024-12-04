import {getInput, getTestFunction} from './helper';

const DAY = 3;

type Input = string;

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input) {
  let result = 0;
  const re = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let m
  do {
    m = re.exec(input);
    if (m) {
      result += +m[1] * +m[2];
    }
  } while (m);
  return result;
}

function calculatePart2(input: Input) {
  let result = 0;
  const arr1: string[] = [];
  let arr = input.split('don\'t()');
  arr1.push(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    arr1.push(...arr[i].split('do()').slice(1))
  }
  for (const v of arr1) {
    const re = /mul\((\d{1,3}),(\d{1,3})\)/g;
    let m
    do {
      m = re.exec(v);
      if (m) {
        result += +m[1] * +m[2];
      }
    } while (m);
  }

  return result;
}


function parse(input: string): Input {
  return input;
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
  part1Test('xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))', 161);

  console.log('---------------------');

  part2Test('xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))', 48);

  console.log('---------------------');
}
