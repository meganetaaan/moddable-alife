/* eslint-disable no-debugger */
import LifeGame from 'lifegame2'
import { Application, Port, Behavior, Skin } from 'piu/MC'
import Timer from 'timer'
import type Monitor from 'pins/digital/monitor'

declare function trace(message: number | string): void
declare const global: {
  button?: {
    a: Monitor
    b: Monitor
    c: Monitor
  }
}
const EVENT_ONGAMEINIT = 'onGameInit'

class LifeGameBehavior extends Behavior {
  lifeGame?: LifeGame
  onCreate(port: Port) {
    this.lifeGame = new LifeGame({
      width: 64,
      height: 48,
    })
    Timer.repeat(() => {
      this.lifeGame?.tick()
      port.invalidate()
    }, 1000)
    this.onGameInit()
  }
  onGameInit() {
    this.lifeGame?.init()
  }
  onDraw(port: Port): void {
    port.fillColor('black', 0, 0, 320, 240)
    const lg = this.lifeGame as LifeGame
    const width = lg.width
    lg.cells.forEach((c: number) => {
      const top = Math.floor(c / width)
      const left = c % width
      port.fillColor('white', left * 5, top * 5, 4, 4)
    })
  }
}

interface LifeGamePort extends Port {
  lifeGame?: LifeGame
}

const lifeGamePort: LifeGamePort = new Port(null, {
  Behavior: LifeGameBehavior,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const application = new Application(null, {
  skin: new Skin({
    fill: 'black',
  }),
  contents: [lifeGamePort],
  displayListLength: 4096 * 4,
  commandListLength: 4096 * 4,
})

if (global.button != null) {
  global.button.a.onChanged = function () {
    if (this.read()) {
      lifeGamePort.delegate(EVENT_ONGAMEINIT)
    }
  }
}
