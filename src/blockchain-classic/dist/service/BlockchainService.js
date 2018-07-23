"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}class BlockchainService {

  constructor(blockService) {_defineProperty(this, "blockService", void 0);
    this.blockService = blockService;
  }

  get blockService() {
    return this.blockService;
  }}var _default =


BlockchainService;exports.default = _default;