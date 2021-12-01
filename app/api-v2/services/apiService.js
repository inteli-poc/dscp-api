const { ApiPromise, WsProvider } = require('@polkadot/api')
const { METADATA_KEY_LENGTH, METADATA_VALUE_LITERAL_LENGTH, API_HOST, API_PORT } = require('../../env')
const { getReadableMetadataKeys } = require('../../util/appUtil')
const provider = new WsProvider(`ws://${API_HOST}:${API_PORT}`)
const apiOptions = {
  provider,
  types: {
    Address: 'MultiAddress',
    LookupSource: 'MultiAddress',
    PeerId: 'Vec<u8>',
    Key: 'Vec<u8>',
    TokenId: 'u128',
    TokenMetadataKey: `[u8; ${METADATA_KEY_LENGTH}]`,
    TokenMetadataValue: 'MetadataValue',
    Token: {
      id: 'TokenId',
      owner: 'AccountId',
      creator: 'AccountId',
      created_at: 'BlockNumber',
      destroyed_at: 'Option<BlockNumber>',
      metadata: 'BTreeMap<TokenMetadataKey, TokenMetadataValue>',
      parents: 'Vec<TokenId>',
      children: 'Option<Vec<TokenId>>',
    },
    MetadataValue: {
      _enum: {
        File: 'Hash',
        Literal: `[u8; ${METADATA_VALUE_LITERAL_LENGTH}]`,
        None: null,
      },
    },
  },
}
const api = new ApiPromise(apiOptions)

async function getLastTokenId() {
  await api.isReady
  const lastTokenId = await api.query.simpleNftModule.lastToken()

  return lastTokenId ? parseInt(lastTokenId, 10) : 0
}

async function getItemById(tokenId) {
  let response = {}

  if (tokenId) {
    await api.isReady
    const item = await api.query.simpleNftModule.tokensById(tokenId)

    response = item.toJSON()
  }

  response.metadata = getReadableMetadataKeys(response.metadata)

  return response
}

module.exports = {
  getLastTokenId,
  getItemById,
}
