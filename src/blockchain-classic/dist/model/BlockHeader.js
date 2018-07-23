"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;class BlockHeader {
  constructor(previousHash) {
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.hash = '';
    this.nonce = 0;
    this.difficulty = 2;
    this.version = '1.0';
  }

  get hash() {
    return this.hash;
  }

  get previousHash() {
    return this.previousHash;
  }

  get timestamp() {
    return this.timestamp;
  }

  get nonce() {
    return this.nonce;
  }}var _default =


BlockHeader;exports.default = _default;