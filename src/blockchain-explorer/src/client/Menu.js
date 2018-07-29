import readline from 'readline'
import { resolve } from 'url'

class Menu {
  actions = []
  itemsCount = 0
  actionsMap = new Map()
  constructor (actions) {
    this.actions = actions
    this.itemsCount = actions.length
    this.actions.forEach((a, i) => {
      this.actionMap.set(i, a)
    })
    this.rl = readline.createInterface({
      terminal: true,
      input: process.stdin,
      output: process.stdout
    })
  }
  async display () {
    return new Promise(resolve => {
      let cursporPos = 0 // keeps position of cursor on menu items
      this.rl.question(menu`Pick your actions ${this.actions}`, answer => {
        if (!answer || answer.length === 0) {
          // Move cursor to the bottom
          this.rl.output.write(cursorDown(this.itemsCount - cursporPos))
          resolve(this.actionsMap.get(cursporPos))
        } else {
          console.log(`Your selection is: ${answer}`)
          const index = parseInt(answer)
          resolve(
            this.actionsMap.has(parseInt(index))
              ? this.actionsMap.get(index)
              : this.actionsMap.get(0)
          )
        }
        readline.clearScreenDown()
        this.rl.close()
      })
      this.rl.output.write(cursorUp(this.itemsCount))

      readline.emitKeypressEvents(process.stdin)
      if (process.stdin.isTTY) {
        // Support scroll up and down using the keyboard
        process.stdin.setRawMode(true)
        this.rl.input.on('keypress', (value, key) => {
          if (isKillSequence(key)) {
            process.exit()
          } else {
            if (isUpKey(key)) {
              if (cursporPos > 0) {
                this.rl.output.write(cursorUp(1))
                cursporPos--
              }
            } else if (isDownKey(key)) {
              if (cursporPos < this.itemsCount - 1) {
                this.rl.output.write(cursorDown(1))
                cursporPos++
              }
            }
          }
        })
      } else {
        // Handle numerical values at the bottom of the menu
        this.rl.output.write(cursorDown(this.itemsCount))
      }
    })
  }
}

export default Menu
