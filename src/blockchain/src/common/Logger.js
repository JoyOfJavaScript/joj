import Combinators from '~util/fp/combinators.js'

export const Levels = new Map([['TRACE', 0], ['INFO', 1], ['WARN', 2], ['ERROR', 3]])

const log = Combinators.curry((level, message, error = null) => {
  if (Levels.has(getLogSetting()) <= level) {
    console.log(
      `[${getLogSetting()}] ${new Date(Date.now()).toString()} ${message}`,
      level === error && error ? error.message : ''
    )
  }
})

const getLogSetting = () => (process.env.LOG ? process.env.LOG.toUpperCase() : 'ERROR')

export default {
  log,
  trace: log(Levels.get('TRACE')),
  info: log(Levels.get('INFO')),
  warn: log(Levels.get('WARN')),
  error: log(Levels.get('ERROR'))
}
