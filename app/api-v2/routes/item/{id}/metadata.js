const { getMetadataResponse } = require('../../../../util/appUtil')
const { LEGACY_METADATA_KEY } = require('../../../../env')

module.exports = function () {
  const doc = {
    GET: async function (req, res) {
      return getMetadataResponse(req.params.id, LEGACY_METADATA_KEY, res)
    },
  }

  doc.GET.apiDoc = {
    summary: 'Get metadata with legacy key',
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
        description: 'Return legacy metadata',
        content: {
          'text/plain': {
            schema: {
              $ref: '#/components/schemas/MetadataNone',
            },
          },
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MetadataLiteral',
            },
          },
          'application/octet-stream': {
            schema: {
              $ref: '#/components/schemas/MetadataFile',
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
    security: [{ bearerAuth: [] }],
    tags: ['item'],
  }

  return doc
}
