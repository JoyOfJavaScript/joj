import { MAX_NODES, SYNC_TIMER } from '../../common/settings'

export default class JSLiteNetwork {
  #nodes = new Array(MAX_NODES)
  #nodeDifficulty = new Map()
  #intervalId
  #intervalTimer = 0

  constructor() {
    this.startInterval()
  }

  async addNode() {
    const difficulty = JSLiteNetwork.computeNewDifficulty()
    const node = new Node(123, difficulty)
    this.#nodes.push(node)
    this.#nodeDifficulty.put(difficulty, node)

    // Register listener for mine actions
  }

  startInterval() {
    this.#intervalId = setInterval(() => {
      // Notify nodes to begin mining
    }, SYNC_TIMER)
  }

  static computeNewDifficulty() {
    // https://github.com/babel/babel/issues/8052
    return 2
  }
}

class Node {
  id
  difficulty
  constructor(id, difficulty) {
    this.id = id
    this.difficulty = difficulty
  }
}
