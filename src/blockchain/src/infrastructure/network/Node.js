/**
 * Mining nodes
 */
export default class Node {
  address
  difficulty
  displayName
  #emitter
  constructor(displayName, address, difficulty, emmitter, mineBlockFn) {
    this.displayName = displayName
    this.address = address
    this.difficulty = difficulty
    this.mineBlockFn = mineBlockFn
    this.#emitter = emmitter
    this.listenForMineEvent()
    console.log(`Initialized new miner node with difficulty ${difficulty}`)
  }

  discoverPeers() {}

  listenForMineEvent() {
    this.#emitter.on('MINE_BLOCK', async () => {
      console.log(`${this.displayName}: Beginning mining process`)
      try {
        const minedBlock = await this.mineBlockFn()
        console.log(
          `${this.displayName} just mined ${minedBlock.hash} with index ${minedBlock.index}`
        )
      } catch (e) {
        // Block was rejected, skip
        console.log(`Block from ${this.displayName} was rejected`)
      }
    })
  }
}
