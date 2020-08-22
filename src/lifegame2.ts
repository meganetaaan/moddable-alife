// declare function trace(str: string): void
const MAX_SIZE = 320 * 240
class Matrix {
  #buffer: ArrayBuffer
  #view: DataView
  #height: number
  #width: number
  constructor({ height, width }: { height: number; width: number }) {
    if (height * width > MAX_SIZE) {
      throw new Error('MaxSizeExceeded')
    }
    this.#height = height
    this.#width = width
    this.#buffer = new ArrayBuffer(Math.ceil((this.#height * this.#width) / 8))
    this.#view = new DataView(this.#buffer) //, 0, Math.ceil((this.#height * this.#width) / 8))
  }
  init(): void {
    for (let i = 0; i < this.#height * this.#width; i++) {
      const bit = Math.random() > 0.7 ? 1 : 0
      this.setBit(i, bit)
    }
  }
  private getBit(idx: number): number {
    const n = this.#view.getUint8(idx / 8)
    return (n >> idx % 8) & 0b00000001
  }
  private setBit(idx: number, value: number): void {
    const i = idx / 8
    const mod = idx % 8
    const mask = ~(0b00000001 << mod) as number
    const n = this.#view.getUint8(i)
    this.#view.setUint8(i, (n & mask) | (value << mod))
  }
  get(top: number, left: number): number {
    const idx = this.#width * top + left
    return this.getBit(idx)
  }
  set(top: number, left: number, value: number): void {
    top = top % this.#height
    left = left % this.#width
    this.setBit(this.#width * top + left, value)
  }
  get cells(): number[] {
    const result = []
    for (let idx = 0, len = this.#height * this.#width; idx < len; idx++) {
      if (this.getBit(idx)) {
        result.push(idx)
      }
    }
    return result
  }
  toString(): string {
    let str = ''
    for (let i = 0; i < this.#height; i++) {
      for (let j = 0; j < this.#width; j++) {
        str += this.getBit(i * this.#width + j) ? '1' : '0'
      }
      str += '\n'
    }
    return str
  }
}
Object.freeze(Matrix)

function noop() {
  // do nothing
}
class LifeGame {
  static DEFAULT_HEIGHT = 64
  static DEFAULT_WIDTH = 64
  #height: number
  #width: number
  #state: Matrix
  #nextState: Matrix
  onTick?: (lg: LifeGame) => void = noop
  onInit?: (lg: LifeGame) => void = noop
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
  get cells(): number[] {
    return this.#state.cells
  }
  show(): void {
    // console.log(this.#state.toString())
  }
  tick(): void {
    const state = this.#state
    const nextState = this.#nextState
    const height = this.#height
    const width = this.#width
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const t = i
        const st = t === 0 ? height - 1 : t - 1
        const gt = t === height - 1 ? 0 : t + 1
        const l = j
        const sl = l === 0 ? width - 1 : l - 1
        const gl = l === width - 1 ? 0 : l + 1
        const nw = state.get(st, sl)
        const n = state.get(st, l)
        const ne = state.get(st, gl)
        const w = state.get(t, sl)
        const c = state.get(t, l)
        const e = state.get(t, gl)
        const sw = state.get(gt, sl)
        const s = state.get(gt, l)
        const se = state.get(gt, gl)
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

export { LifeGame as default, Matrix }
