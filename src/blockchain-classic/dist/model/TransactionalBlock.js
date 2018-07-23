"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _BlockHeader = _interopRequireDefault(require("./BlockHeader"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch4.md
class TransactionalBlock extends _BlockHeader.default {
  constructor(previousHash, pendingTransactions) {
    super(previousHash);
    this.pendingTransactions = pendingTransactions;
  }

  get pendingTransactions() {
    return this.pendingTransactions;
  }}var _default =


TransactionalBlock;exports.default = _default;