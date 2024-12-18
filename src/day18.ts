import {getInput, getTestFunction} from './helper';
import {Pos, PosSet} from './utils';

const DAY = 18;

type Input = Pos[];
type VisitedMap = {[pos: string]: number}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});

function calculatePart1(input: Input, size = new Pos(70, 70), first: number = 1024) {
  const posSet = new PosSet();
  for (let i = 0; i < first; i++) {
    posSet.add(input[i]);
  }
  const posArray = [new Pos(0,0)];
  const visitedMap: VisitedMap = {[new Pos(0,0).ser()]: 0};

  while (posArray.length > 0) {
    const pos = posArray.shift()!;
    for (const near of pos.getNear4()) {
      if (near.x < 0 || near.x > size.x || near.y < 0 || near.y > size.y) {
        continue
      }
      if (posSet.has(near)) {
        continue;
      }
      if (visitedMap[near.ser()] == null || visitedMap[near.ser()] > visitedMap[pos.ser()] + 1) {
        visitedMap[near.ser()] = visitedMap[pos.ser()] + 1;
        posArray.push(near);
      }
    }
  }
  return visitedMap[size.ser()];
}

function calculatePart2(input: Input, size = new Pos(70, 70), first: number = 1024) {
  let result = 0;
  for (let i = first + 1; i < input.length; i++) {
    if (!calculatePart1(input, size, i)) {
      return input[i-1].x + ',' + input[i-1].y;
    }
  }
  return result;
}


function parse(input: string): Input {
  return input.split('\n').map((line) => new Pos(...line.split(',').map(v => +v) as [number, number]));
}

export async function run() {
  const input: string = await getInput(DAY);
  const result1 = calculatePart1(parse(input));
  const result2 = calculatePart2(parse(input));
  return [result1, result2]
}

function tests() {
  const part1Test = getTestFunction((input) => calculatePart1(parse(input), new Pos(6, 6), 12));
  const part2Test = getTestFunction((input) => calculatePart2(parse(input), new Pos(6, 6), 12));
  const input = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`
  part1Test(input, 22);

  console.log('---------------------');

  part2Test(input, '6,1');

  console.log('---------------------');
}
