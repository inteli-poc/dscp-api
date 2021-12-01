const { validateTokenId } = require('../../../util/appUtil')
const logger = require('../../../logger')

module.exports = function (apiService) {
  const doc = {
    GET: async function (req, res) {
      const id = validateTokenId(req.params.id)

      if (!id) {
        logger.trace(`Invalid id: ${req.params.id}`)
        res.status(400).json({ message: `Invalid id: ${req.params.id}` })
      } else {
        try {
          const result = apiService.getItemById(id)

          if (result.id === id) {
            res.status(200).json(result)
          } else {
            res.status(404).json({
              message: `Id not found: ${id}`,
            })
          }
        } catch (err) {
          logger.error(`Error token. Error was ${err.message || JSON.stringify(err)}`)
          if (!res.headersSent) {
            res.status(500).send(`Error getting token`)
          }
        }
      }
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get item',
    parameters: [
      {
        description: 'Id of the item',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return item',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Item',
            },
          },
        },
      },
      404: {
        description: 'Resource does not exist',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
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
    tags: ['item'],
  }

  return doc
}
