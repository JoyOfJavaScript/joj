import chai from 'chai'

const { assert } = chai

describe('5.5 - Kinds of algebraic data types', () => {
  it('Records', () => {
    const Pair = (left, right) => ({
      left,
      right,
      toString: () => `Pair [${left}, ${right}]`
    })
    const name = Pair('Luis', 'Atencio')
    assert.equal(name.left, 'Luis')
    assert.equal(name.right, 'Atencio')
  })

  it('Validation using OLOO', () => {
    const Validation = {
      init: function (value) {
        this.isSuccess = false;
        this.isFailure = false;
        this.equals = otherValidation => value === otherValidation.get();
        this.getOrElse = defaultVal => this.isSuccess ? value : defaultVal;
        this.toString = () => `Validation (${value}) `;
        this.get = () => value;
        return this;
      }
    }

    const Success = Object.create(Validation);
    Success.of = function (value) {
      this.init(value);
      this.isSuccess = true;
      this.toString = () => `Success (${value})`;
      return this;
    }

    const Failure = Object.create(Validation);
    Failure.of = function of(errorMsg) {
      this.init(errorMsg);
      this.get = () => throw new TypeError(`Can't extract the value of a Failure`);
        this.toString = () => `Failure (${errorMsg})`;
        return this;
      }

      const Functor = {
        map(f = identity) {  //#A
          return this.of(f(this.get()));  //#B
        }
      }

      const NoopFunctor = {
        map(f = identity) {  //#A
          return this;  //#B
        }
      }

      Object.assign(Success, Functor); // mixin
      Object.assign(Failure, NoopFunctor); // mixin

      // Helper
      Validation.of = function ValidationOf(value) {
        return Object.createa(Success).of(value);
      }

      const toUpper = str => str.toUpperCase();
      const fromNullable = value =>
        (value === null)
          ? Failure.of('Expected non-null value')
          : Success.of(value);

      assert.equal('Success (JOJ)', fromNullable('joj').map(toUpper).toString()); // 'Success (JOJ)'
      assert.equal('Failure (Expected non-null value)', fromNullable(null).map(toUpper).toString());
    })
})
