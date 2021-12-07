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
      AuthToken: {
        type: 'object',
        properties: {
          access_token: {
            description: 'authentication token',
            type: 'string',
          },
          expires_in: {
            description: 'expiry delta time in milliseconds',
            type: 'number',
          },
          token_type: {
            description: 'type of the authentication token',
            type: 'string',
          },
        },
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
          metadata_keys: {
            description: 'metadata keys of the item',
            type: 'array',
          },
        },
        required: ['id', 'owner', 'creator', 'created_at', 'destroyed', 'parents', 'children', 'metadata'],
      },
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
      Member: {
        type: 'object',
        properties: {
          address: {
            description: 'token of the member',
            type: 'string',
          },
        },
        required: ['address'],
      },
      LegacyMetadata: {
        type: 'object',
        properties: {
          message: {
            description: 'message of the legacy metadata',
            type: 'string',
          },
        },
      },
      Metadata: {
        type: 'object',
        properties: {
          id: {
            description: 'id of the token',
            type: 'number',
          },
          metadata: {
            description: 'id of the token',
            type: 'array',
          },
        },
        required: ['id', 'metadata'],
      },
      RunProcess: {
        description: 'minted token',
        type: 'string',
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },

  paths: {},
}

module.exports = apiDoc
