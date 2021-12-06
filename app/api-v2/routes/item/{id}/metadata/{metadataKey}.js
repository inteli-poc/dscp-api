const { getMetadataResponse } = require('../../../../../util/appUtil')

module.exports = function () {
  const doc = {
    GET: async function (req, res) {
      console.log('V2 /item/{id}/metadata/{metadataKey}')

      return getMetadataResponse(req.params.id, req.params.metadataKey, res)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get metadata',
    parameters: [
      {
        description: 'Id of the item',
        in: 'path',
        required: true,
        name: 'id',
        allowEmptyValue: true,
      },
      {
        description: 'Metadata key of the item',
        in: 'path',
        required: true,
        name: 'metadataKey',
        allowEmptyValue: true,
      },
    ],
    responses: {
      200: {
        description: 'Return metadata',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Metadata',
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
