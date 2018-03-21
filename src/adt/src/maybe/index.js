const id = a => a

const Maybe = a => ({
  map: f => (a ? Maybe(f(a)) : Maybe(/* Empty */)),
  fold: (f = id) => (a ? f(a) : 'Empty'),
  flatMap: f => Maybe(f(a.fold())),
  ap: Ma =>
    Ma.fold() === 'Empty'
      ? Maybe(/* Empty */)
      : a && typeof a === 'function'
        ? Maybe(
            typeof Ma.fold() === 'function'
              ? Ma.fold().call(Ma, a)
              : a(Ma.fold())
          )
        : a ? Maybe(Ma.fold().call(Ma, a)) : Maybe(/* Empty */)
})
Maybe['@@type'] = 'Maybe'
module.exports = Maybe
