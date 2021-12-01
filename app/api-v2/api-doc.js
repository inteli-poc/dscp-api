const { PORT, API_VERSION, API_MAJOR_VERSION } = require('../env')

const apiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'ApiService',
    version: API_VERSION,
  },
  servers: [
    {
      url: `http://localhost:${PORT}/${API_MAJOR_VERSION}`,
    },
  ],
  components: {
    responses: {
      NotFoundError: {
        description: 'This resource cannot be found',
      },
      BadRequestError: {
        description: 'The request is invalid',
      },
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
      },
      Error: {
        description: 'An error occurred',
      },
    },
    schemas: {
      LastToken: {
        type: 'object',
        properties: {
          id: {
            description: 'id of the token',
            type: 'number',
          },
        },
        required: ['id'],
      },
      Item: {
        type: 'object',
        properties: {
          id: {
            description: 'id of the item',
            type: 'number',
          },
          owner: {
            description: 'owner token of the item',
            type: 'string',
          },
          creator: {
            description: 'creator token of the item',
            type: 'string',
          },
          created_at: {
            description: 'block number the item was created at',
            type: 'number',
          },
          destroyed: {
            description: 'block number the item was destroyed',
            type: 'number',
          },
          parents: {
            description: 'parents of the item',
            type: 'array',
          },
          children: {
            description: 'children of the item',
            type: 'array',
          },
          metadata: {
            description: 'metadata of the item',
            type: 'array',
          },
        },
        required: ['id', 'owner', 'creator', 'created_at', 'destroyed', 'parents', 'children', 'metadata'],
      },
    },
  },
  paths: {},
}

module.exports = apiDoc
