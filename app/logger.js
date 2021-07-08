const pino = require('pino')
const { LOG_LEVEL } = require('./env')

module.exports = pino(
  {
    name: 'API',
    level: LOG_LEVEL,
  },
  process.stdout
)
