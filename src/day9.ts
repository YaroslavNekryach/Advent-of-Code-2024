import {getInput, getTestFunction} from './helper';

const DAY = 9;

type Input = { files: number[], space: number[] };

class File {
  constructor(public readonly id: number, public readonly length: number, public pos: number) {
  }
}

class Space {
  constructor(public length: number, public pos: number) {
  }
}

class FileSystem {
  files: File[];
  space: Space[];

  constructor() {
    this.files = [];
    this.space = [];
  }

  addFile(file: File) {
    this.files.push(file);
  }

  addSpace(space: Space) {
    this.space.push(space);
  }


  fragment(i: number) {
    const file = this.files[i];
    for(const space of this.space) {
      if (space.pos > file.pos) {
        break;
      }
      if (space.length >= file.length) {
        file.pos = space.pos;
        space.pos += file.length;
        space.length -= file.length;
        break;
      }
    }
    // this.log();
  }

  fragmentAll() {
    for(let i = this.files.length - 1; i >= 0; i--) {
      this.fragment(i)
    }
  }

  fileCheck(file: File): number {
    let result = 0;
    for (let i = 0; i < file.length; i++ ) {
      result += (file.pos + i) * file.id
    }
    return result;
  }

  check(): number {
    let result = 0;
    for (const file of this.files) {
      result += this.fileCheck(file);
    }
    return result;
  }

  log() {
    const arr = [];
    for (const file of this.files) {
      for (let i = 0; i < file.length; i++) {
        arr[file.pos + i] = file.id;
      }
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == null) {
        arr[i] = '.';
      }
    }
    console.log(arr.join(''));
  }
}

tests();
run().then(([result1, result2]) => {
  console.log('Part 1:', result1);
  console.log('Part 2:', result2);
});


function calculatePart1(input: Input) {
  let result = 0;
  const {files, space} = input;
  let i = 0;
  let fi = 0;
  const sum = files.reduce((a, b) => a + b, 0);
  loop: while (true) {
    const v = files[fi];
    for (let a = 0; a < v; a++) {
      result += i++ * fi;
      if (i >= sum) {
        break loop
      }
    }
    for (let b = 0; b < space[fi]; b++) {
      const l = getLast(files);
      result += i++ * l;
      if (i >= sum) {
        break loop
      }
    }
    fi++;
  }
  return result;
}

function calculatePart2(input: Input) {
  const fileSystem = new FileSystem();
  let pos = 0;
  const {files, space} = input;
  for (let f = 0; f < files.length; f++) {
    const file = new File(f, files[f], pos);
    pos += file.length;
    const sp = new Space(space[f] || 0, pos)
    pos += sp.length;
    fileSystem.addFile(file);
    fileSystem.addSpace(sp);
  }

  fileSystem.fragmentAll();
  return fileSystem.check();
}

function getLast(num: number[]): number {
  if (num[num.length - 1] !== 0) {
    num[num.length - 1]--;
    return num.length - 1;
  } else {
    num.length--;
    return getLast(num);
  }
}


function parse(input: string): Input {
  const all = input.split('').map(v => +v);
  const files = all.filter((v, i) => !(i % 2));
  const space = all.filter((v, i) => i % 2);
  return {files, space};
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
  const input = `2333133121414131402`;
  part1Test(input, 1928);
  console.log('---------------------');

  part2Test(input, 2858);
  console.log('---------------------');
}
