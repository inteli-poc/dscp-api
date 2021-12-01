const logger = require('../../logger')

module.exports = function (apiService) {
  const doc = {
    GET: async function (req, res) {
      try {
        const result = await apiService.getLastTokenId()
        res.status(200).json({ id: result })
      } catch (err) {
        logger.error(`Error getting latest token. Error was ${err.message || JSON.stringify(err)}`)
        if (!res.headersSent) {
          res.status(500).send(`Error getting latest token`)
        }
      }
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get last token',
    responses: {
      200: {
        description: 'Return last token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LastToken',
            },
          },
        },
      },
      default: {
        description: 'An error occurred',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/Error',
            },
          },
        },
      },
    },
    tags: ['token'],
  }

  return doc
}
