export class Pos {

  constructor(public x: number, public y: number) {
  }

  ser(): string {
    return `${this.x}_${this.y}`
  }

  static de(s: string): Pos {
    const [x, y] = s.split('_');
    return new Pos(+x, +y)
  }

  up(): Pos {
    return new Pos(this.x, this.y - 1)
  }

  down(): Pos {
    return new Pos(this.x, this.y + 1)
  }

  left(): Pos {
    return new Pos(this.x - 1, this.y)
  }

  right(): Pos {
    return new Pos(this.x + 1, this.y)
  }

  mutUp() {
    this.y--;
  }

  mutDown() {
    this.y++;
  }

  mutLeft() {
    this.x--;
  }

  mutRight() {
    this.x++;
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
  private map: T[][];
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
}

export abstract class AbstractSet<T> {
  private set = new Set<string>;

  add(v: T) {
    this.set.add(this.ser(v));
  }

  values(): T[] {
    return [...this.set].map(v=> this.de(v));
  }

  get size(): number {
    return this.set.size;
  }

  protected abstract ser(v: T): string;
  protected abstract de(s: string): T;
}

class PosSet extends AbstractSet<Pos>{

  protected ser(pos: Pos): string {
    return pos.ser();
  }
  protected de(s: string): Pos {
    return Pos.de(s);
  }
}
