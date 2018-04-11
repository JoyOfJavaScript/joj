import { Combinators } from '@joj/adt'

export const Levels = {
  TRACE: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

const log = Combinators.curry((level, message, error = null) => {
  if (Levels[getLogSetting()] <= level) {
    console.log(
      `[${getLogSetting()}] ${new Date(Date.now()).toString()} ${message}`,
      level === error && error ? error.message : ''
    )
  }
})

const getLogSetting = () =>
  process.env.LOG ? process.env.LOG.toUpperCase() : 'ERROR'

export default {
  log,
  trace: log(Levels.TRACE),
  info: log(Levels.INFO),
  warn: log(Levels.WARN),
  error: log(Levels.ERROR),
}
