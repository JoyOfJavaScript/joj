Object.create = function(proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw TypeError('Object prototype may only be an Object: ' + proto);
  }
  function F() {}
  F.prototype = proto;
  return new F();
};

const MyStore = {
  init: function(element) {
    this.length = 0;
    this.push(element);
    //return this;
  },

  push(b) {
    this[this.length] = b;
    return ++this.length;
  }
};

const Blockchain = Object.create(MyStore); // ?

Blockchain.init('123456789'); //

Blockchain; // ?

Blockchain.push('123'); // ?

Blockchain;
