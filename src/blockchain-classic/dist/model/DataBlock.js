"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _BlockHeader = _interopRequireDefault(require("./BlockHeader"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class DataBlock extends _BlockHeader.default {
  constructor(previousHash, data) {
    super(previousHash);
    this.data = data;
  }

  get data() {
    return this.data;
  }

  static genesis(data) {
    return new DataBlock('-1', data || { data: 'Genesis Block' });
  }}var _default =


DataBlock;exports.default = _default;