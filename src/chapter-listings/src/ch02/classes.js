import { assert, expect } from 'chai';

// MD5 and SHA-1 are no longer acceptable where collision resistance is required such as digital signatures.
// https://github.com/tc39/proposal-class-fields
// https://github.com/tc39/proposal-private-methods
describe('Class-based JavaScript domain modeling', () => {
  it('Studies JavaScript classes', () => {
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
      #funds = 0.0;
      #feePercent = 0.6;
      #transactionId = '';

      constructor(transactionName, fromEmail, toEmail, funds = 0.0) {
        super(transactionName, fromEmail, toEmail);
        this.#transactionId = this.calculateHash();
        this.#funds = funds;
      }

      addFunds(amount) {
        this.#funds += amount;
      }

      subtractFunds(amount) {
        this.#funds -= amount;
      }

      get netTotal() {
        return MoneyTransaction.precisionRound(
          this.#funds * this.#feePercent,
          2
        );
      }

      static precisionRound(number, precision) {
        //TODO: static #precisionRound(number, precision) {
        //TODO: Make this private when bug fixed. https://github.com/babel/babel/issues/8484
        const factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }

      calculateHash() {
        const data = [this.fromEmail, this.toEmail, this.#funds].join('');
        let hash = 0,
          i = 0;
        const len = data.length;
        while (i < len) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0;
        }
        return hash ** 2;
      }
    }

    const inst1 = new MoneyTransaction(
      'Transfer',
      'luke@joj.com',
      'luis@joj.com'
    );
    inst1.addFunds(10);
    assert.equal(inst1.netTotal, 6);

    const tx1 = new MoneyTransaction(
      'Transfer',
      'luis@joj.com',
      'luke@joj.com'
    );
    tx1.addFunds(10);
    assert.isOk(tx1.calculateHash() > 0);
    assert.equal(tx1.calculateHash(), 197994095955825630);

    assert.isOk(Object.getPrototypeOf(tx1) === MoneyTransaction.prototype);
    assert.isOk(tx1 instanceof MoneyTransaction);
    assert.isOk(tx1 instanceof MoneyTransaction);
    assert.isOk(tx1 instanceof Transaction);
    assert.isOk(tx1 instanceof Object);
    assert.equal(tx1.fromEmail, 'luis@joj.com');

    const tx2 = new MoneyTransaction(
      'Online item',
      'luke@joj.com',
      'ana@joj.com'
    );
    tx2.addFunds(20);

    const tx3 = new MoneyTransaction('Coffee', 'ana@joj.com', 'luis@joj.com');
    tx3.addFunds(5.5);

    console.table(
      [tx1, tx2, tx3].map(
        ({
          fromEmail: from,
          toEmail: to,
          transactionName: type,
          netTotal: net_total,
        }) => ({
          from,
          to,
          type,
          net_total,
        })
      )
    );

    class SecureMoneyTransaction extends MoneyTransaction {
      senderKey;
      receiverKey;
      constructor(name, senderKey, receiverKey) {
        super(name, 'anonymous@joj.com', 'anonymous@joj.com');
        this.senderKey = this.verifySignature(senderKey);
        this.receiverKey = this.verifySignature(receiverKey);
      }

      verifySignature(k) {
        return k;
      }

      calculateHash() {
        this.fromEmail = this.senderKey.toString();
        this.toEmail = this.receiverKey.toString();
        return super.calculateHash();
      }
    }
  });
});
