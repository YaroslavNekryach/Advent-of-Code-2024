export class Pos {

  static readonly UP = new Pos(0, -1);
  static readonly DOWN = new Pos(0, 1);
  static readonly LEFT = new Pos(-1, 0);
  static readonly RIGHT = new Pos(1, 0);

  constructor(public x: number, public y: number) {
  }

  ser(): string {
    return `${this.x}_${this.y}`
  }

  static de(s: string): Pos {
    const [x, y] = s.split('_');
    return new Pos(+x, +y)
  }

  add(pos: Pos): Pos {
    return new Pos(this.x + pos.x, this.y + pos.y);
  }

  addMut(pos: Pos): Pos {
    this.x += pos.x;
    this.y += pos.y;
    return this
  }

  up(): Pos {
    return this.add(Pos.UP);
  }

  down(): Pos {
    return this.add(Pos.DOWN);
  }

  left(): Pos {
    return this.add(Pos.LEFT);
  }

  right(): Pos {
    return this.add(Pos.RIGHT);
  }

  mutUp(): Pos {
    return this.addMut(Pos.UP);
  }

  mutDown(): Pos {
    return this.addMut(Pos.DOWN);
  }

  mutLeft(): Pos {
    return this.add(Pos.LEFT);
  }

  mutRight(): Pos {
    return this.addMut(Pos.RIGHT);
  }

  eq(p: Pos): boolean {
    return this.x === p.x && this.y === p.y;
  }


  getNear4(): Pos[] {
    return [this.up(), this.down(), this.left(), this.right()]
  }

  getNear8(): Pos[] {
    return [
      new Pos(this.x - 1, this.y - 1),
      this.up(),
      new Pos(this.x - 1, this.y + 1),
      this.left(),
      this.right(),
      new Pos(this.x + 1, this.y - 1),
      this.down(),
      new Pos(this.x + 1, this.y + 1),
    ]
  }

}

export class Map<T> {
  public map: T[][];
  readonly width: number;
  readonly height: number;

  constructor(map: T[][]) {
    this.map = map;
    this.height = map.length;
    this.width = map[0].length;
  }

  get(x: number, y: number): T | undefined;
  get(pos: Pos): T | undefined;
  get(posOrX: number | Pos, y?: number): T | undefined {
    if (typeof posOrX === 'number') {
      if (y == null) {
        throw new Error('y is required')
      }
      return this.map[y]?.[posOrX]
    } else {
      return this.map[posOrX.y]?.[posOrX.x]
    }
  }

  set(x: number, y: number, value: T): void;
  set(pos: Pos, value: T): void;
  set(posOrX: number | Pos, yOrValue: number | T, valueOrNone?: T): void {
    let x: number, y: number;
    let value: T;
    if (typeof posOrX === 'number') {
      if (typeof yOrValue !== 'number') {
        throw new Error('second arg must be a number')
      }
      x = posOrX;
      y = yOrValue;
      if (valueOrNone == null) {
        throw new Error('third arg is required')
      }
      value = valueOrNone;
    } else {
      x = posOrX.x;
      y = posOrX.y;
      value = yOrValue as T;
    }
    if (this.map[y]?.[x] !== undefined) {
      this.map[y][x] = value;
    }
  }

  *pos(): Generator<Pos> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield new Pos(x, y);
      }
    }
  }

  *values(): Generator<T> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield this.get(x, y)!;
      }
    }
  }

  *[Symbol.iterator](): Generator<[Pos, T]> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pos = new Pos(x, y)
        yield [pos, this.get(pos)!];
      }
    }
  }

  log() {
    console.log(this.map.map(r => r.join('')).join('\n'));
  }
}

export abstract class AbstractSet<T> {
  private set = new Set<string>;

  add(v: T) {
    this.set.add(this.ser(v));
  }

  has(v: T): boolean   {
    return this.set.has(this.ser(v));
  }

  delete(v: T) {
    return this.set.delete(this.ser(v));
  }

  values(): T[] {
    return [...this.set].map(v=> this.de(v));
  }

  *[Symbol.iterator](): Generator<T> {
    for (const v of this.set) {
      yield this.de(v);
    }
  }

  get size(): number {
    return this.set.size;
  }

  protected abstract ser(v: T): string;
  protected abstract de(s: string): T;
}

export class PosSet extends AbstractSet<Pos>{

  protected ser(pos: Pos): string {
    return pos.ser();
  }
  protected de(s: string): Pos {
    return Pos.de(s);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clearConsole() {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
}
