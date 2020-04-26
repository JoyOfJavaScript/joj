import EventEmitter from 'events'
import chai from 'chai'

const { assert } = chai

describe('9.3.1 - What is a stream', () => {
  it('Simple event emitter example', () => {
    let ran = false;
    const myEmmitter = new EventEmitter()
    myEmmitter.on('some_event', () => {   //#A
      console.log('An event occurred!')
      ran = true
      assert.isOk(ran)
    })
    myEmmitter.emit('event') //#B    
  })
})