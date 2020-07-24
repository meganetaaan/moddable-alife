// declare function trace(str: string): void
class Matrix {
  #count = 0
  #array: Uint8Array
  #height: number
  #width: number
  constructor({ height, width }: { height: number; width: number }) {
    this.#height = height
    this.#width = width
    this.#array = new Uint8Array(this.#height * this.#width)
    // this.#array = []
    this.init()
  }
  init(): void {
    // const arr: number[] = [0]
    for (let i = 0; i < this.#height * this.#width; i++) {
      this.#array[i] = Math.round(Math.random())
      // arr[0] = Math.round(Math.random())
      // this.#array.set(arr, i)
    }
  }
  get(top: number, left: number): number {
    top = top % this.#height
    left = left % this.#width
    const idx = this.#width * top + left
    return this.#array[idx]
    // return this.#array.slice(idx, 1)[0]
  }
  set(top: number, left: number, value: number): void {
    top = top % this.#height
    left = left % this.#width
    this.#array[this.#width * top + left] = value
    // this.#array.set([value], this.#width * top + left)
  }
  toString(): string {
    let str = ''
    for (let i = 0; i < this.#height; i++) {
      const start = i * this.#height
      str += this.#array.slice(start, start + this.#width).join('') + '\n'
    }
    return str
  }
}
Object.freeze(Matrix)

export class LifeGame {
  static DEFAULT_HEIGHT = 64
  static DEFAULT_WIDTH = 64
  #height: number
  #width: number
  #state: Matrix
  #nextState: Matrix
  onTick?: (lg: LifeGame) => void = () => {}
  onInit?: (lg: LifeGame) => void = () => {}
  constructor(param?: { height?: number; width?: number }) {
    this.#height = param?.height ?? LifeGame.DEFAULT_HEIGHT
    this.#width = param?.width ?? LifeGame.DEFAULT_WIDTH
    this.#state = new Matrix({ height: this.#height, width: this.#width })
    this.#nextState = new Matrix({ height: this.#height, width: this.#width })
  }
  get height(): number {
    return this.#height
  }
  get width(): number {
    return this.#width
  }
  getCell(top: number, left: number): number {
    return this.#state.get(top, left)
  }
  setCell(top: number, left: number, value: number): void {
    this.#state.set(top, left, value)
  }
  init(): void {
    this.#state.init()
    if (typeof this.onInit === 'function') {
      this.onInit(this)
    }
  }
  tick(): void {
    const state = this.#state
    const nextState = this.#nextState
    for (let i = 0; i < this.#height; i++) {
      for (let j = 0; j < this.#width; j++) {
        const nw = state.get(i - 1, j - 1)
        const n = state.get(i - 1, j)
        const ne = state.get(i - 1, j + 1)
        const w = state.get(i, j - 1)
        const c = state.get(i, j)
        const e = state.get(i, j + 1)
        const sw = state.get(i + 1, j - 1)
        const s = state.get(i + 1, j)
        const se = state.get(i + 1, j + 1)
        const neighborSum = nw + n + ne + w + e + sw + s + se
        if (c === 0 && neighborSum === 3) {
          nextState.set(i, j, 1)
        } else if (c === 1 && [2, 3].includes(neighborSum)) {
          nextState.set(i, j, 1)
        } else {
          nextState.set(i, j, 0)
        }
      }
    }
    this.#state = nextState
    this.#nextState = state
    if (typeof this.onTick === 'function') {
      this.onTick(this)
    }
  }
}
Object.freeze(LifeGame)
