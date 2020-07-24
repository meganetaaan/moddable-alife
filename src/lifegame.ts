type Cell = number
type Cells = Set<Cell>

declare function trace(message: string): void

function top(cell: Cell): number {
  return cell >> 8
}
function left(cell: Cell): number {
  return cell & 0xff
}
function cell(top: number, left: number) {
  return (top << 8) | left
}

function countNeighbors(c: Cell, cs: Cells, h: number, w: number): number {
  const t = top(c)
  const st = t === 0 ? h - 1 : t - 1
  const gt = t === h - 1 ? 0 : t + 1
  const l = left(c)
  const sl = l === 0 ? w - 1 : l - 1
  const gl = l === w - 1 ? 0 : l + 1
  const count =
    Number(cs.has(cell(st, sl))) +
    Number(cs.has(cell(t, sl))) +
    Number(cs.has(cell(gt, sl))) +
    Number(cs.has(cell(st, l))) +
    Number(cs.has(cell(gt, l))) +
    Number(cs.has(cell(st, gl))) +
    Number(cs.has(cell(t, gl))) +
    Number(cs.has(cell(gt, gl)))
  return count
}

function survive(c: Cell, cs: Cells, h: number, w: number): boolean {
  const nadj = countNeighbors(c, cs, h, w)
  return nadj === 3 || (cs.has(c) && nadj === 2)
}

function addNeighbors(c: Cell, cs: Cells, h: number, w: number): void {
  const t = top(c)
  const st = t === 0 ? h - 1 : t - 1
  const gt = t === h - 1 ? 0 : t + 1
  const l = left(c)
  const sl = l === 0 ? w - 1 : l - 1
  const gl = l === w - 1 ? 0 : l + 1
  cell(st, sl)
  cell(t, sl)
  cell(gt, sl)
  cell(st, l)
  cell(gt, l)
  cell(st, gl)
  cell(t, gl)
  cell(gt, gl)
  cs.add(cell(st, sl))
  cs.add(cell(t, sl))
  cs.add(cell(gt, sl))
  cs.add(cell(st, l))
  cs.add(cell(gt, l))
  cs.add(cell(st, gl))
  cs.add(cell(t, gl))
  cs.add(cell(gt, gl))
}

class LifeGame {
  #cells: Cells = new Set()
  #width: number
  #height: number
  static top = top
  static left = left
  constructor({ height, width }: { height: number; width: number }) {
    this.#width = width
    this.#height = height
  }
  get width(): number {
    return this.#width
  }
  get height(): number {
    return this.height
  }
  get cells(): Cells {
    return this.#cells
  }
  init(): void {
    const cs = new Set<Cell>()
    for (let i = 0; i < this.#height; i++) {
      for (let j = 0; j < this.#width; j++) {
        if (Math.random() > 0.7) {
          cs.add(cell(i, j))
        }
      }
    }
    this.#cells = cs
  }
  tick(): void {
    const current = this.#cells
    const next = new Set<Cell>()
    current.forEach((c) => {
      addNeighbors(c, next, this.#height, this.#width)
    })
    next.forEach((c) => {
      if (!survive(c, current, this.#height, this.#width)) {
        next.delete(c)
      }
    })
    this.#cells = next
  }
}

export { LifeGame }
