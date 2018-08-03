import readline from 'readline'
import { cursorUp, cursorDown } from './ansi'
import { isUpKey, isDownKey, isKillSequence } from './keyboard'

class Menu {
  actions = []
  itemsCount = 0
  actionsMap = new Map()
  rl
  cursorPos = 0
  itemsCount = 0
  static _instance

  constructor (actions) {
    this._createInterface()
    this._reset(0, actions)
  }

  static show (actions) {
    if (!this._instance) {
      this._instance = new Menu(actions)
    } else {
      this._instance._reset(0, actions)
    }
    return this._instance
  }

  _reset (cursorPos, actions) {
    this.cursorPos = cursorPos
    this.actions = actions
    this.itemsCount = actions.length
    this.actions.forEach((a, i) => {
      this.actionsMap.set(i, a)
    })
  }

  _createInterface () {
    this.rl = readline.createInterface({
      terminal: true,
      input: process.stdin,
      output: process.stdout
    })
    const stdin = this.rl.input
    const stdout = this.rl.output
    readline.emitKeypressEvents(stdin)
    if (stdin.isTTY) {
      // Support scroll up and down using the keyboard
      stdin.setRawMode(true)
      stdin.on('keypress', (_, key) => {
        if (isKillSequence(key)) {
          process.exit()
        } else {
          if (isUpKey(key)) {
            if (this.cursorPos > 0) {
              stdout.write(cursorUp(1))
              this.cursorPos--
            }
          } else if (isDownKey(key)) {
            if (this.cursorPos < this.itemsCount - 1) {
              process.stdout.write(cursorDown(1))
              this.cursorPos++
            }
          }
        }
      })
    } else {
      // Handle numerical values at the bottom of the menu
      this.rl.output.write(cursorDown(this.itemsCount))
    }
  }

  async ask () {
    return new Promise(resolve => {
      this.rl.question(menu`Pick your actions ${this.actions}`, answer => {
        readline.clearLine()
        if (!answer || answer.length === 0) {
          // Move cursor to the bottom
          this.rl.output.write(cursorDown(this.itemsCount - this.cursorPos))
          resolve(this.actionsMap.get(this.cursorPos))
        } else {
          console.log(`Your selection is: ${answer}`)
          const index = parseInt(answer)
          resolve(
            this.actionsMap.has(parseInt(index))
              ? this.actionsMap.get(index)
              : this.actionsMap.get(0)
          )
        }
      })
      this.rl.output.write(cursorUp(this.itemsCount))
    })
  }
}

// Private
function menu (header, actionsExp) {
  // We can even return a string built using a template literal
  return `${header[0].trim()}:\n${actionsExp
    .map((a, i) => `${i + 1}-> ${a}\n`)
    .join('')}`
}

export default Menu
