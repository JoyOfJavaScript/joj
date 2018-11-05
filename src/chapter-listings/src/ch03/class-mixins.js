import { assert } from 'chai';

describe('Combining classes with mixins', () => {
  it('Should create an amphibian object', () => {
    const HasHash = () => ({
      calculateHash() {
        console.log('funds', this.funds);
        const data = [this.fromEmail, this.toEmail, this.funds].join('');
        let hash = 0,
          i = 0;
        const len = data.length;
        while (i < len) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0;
        }
        return hash ** 2;
      },
    });

    Object.assign(Transaction.prototype, HasHash());
    const tx = new MoneyTransaction(
      'Online item',
      'luke@joj.com',
      'ana@joj.com'
    );
    tx.addFunds(20);
    assert.equal(tx.calculateHash(), 2182609065832929800);
  });
});

const util = {
  emailValidator(email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new Error(
        `Invalid argument error. Must provide valid email: ${email}`
      );
    }
    return email;
  },
  nameValidator(name) {
    if (!name || name.length === 0) {
      throw new Error(
        `Invalid argument error. Must provide valid name to the transaction`
      );
    }
    return name;
  },
};

class Transaction {
  fromEmail = '';
  toEmail = '';
  #validateEmail = email => util.emailValidator(email);

  constructor(fromEmail, toEmail) {
    this.fromEmail = this.#validateEmail(fromEmail);
    this.toEmail = this.#validateEmail(toEmail);
  }
}

class NamedTransaction extends Transaction {
  #transactionName = 'Generic';
  #validateName = name => util.nameValidator(name);

  constructor(transactionName, fromEmail, toEmail) {
    super(fromEmail, toEmail);
    this.#transactionName = this.#validateName(transactionName);
  }
}

class MoneyTransaction extends NamedTransaction {
  funds = 0.0;
  #feePercent = 0.6;
  #transactionId = '';

  constructor(transactionName, fromEmail, toEmail, funds = 0.0) {
    super(transactionName, fromEmail, toEmail);
    this.#transactionId = this.calculateHash();
    this.funds = funds;
  }

  addFunds(amount) {
    this.funds += amount;
  }

  subtractFunds(amount) {
    this.funds -= amount;
  }

  get netTotal() {
    return MoneyTransaction.precisionRound(this.funds * this.#feePercent, 2);
  }

  static precisionRound(number, precision) {
    //TODO: static #precisionRound(number, precision) {
    //TODO: Make this private when bug fixed. https://github.com/babel/babel/issues/8484
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}
