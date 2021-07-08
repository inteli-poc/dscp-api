const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { AUTH_JWKS_URI, AUTH_AUDIENCE, AUTH_ISSUER } = require('./env')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: AUTH_JWKS_URI,
  }),

  // Validate the audience and the issuer.
  audience: AUTH_AUDIENCE,
  issuer: [AUTH_ISSUER],
  algorithms: ['RS256'],
})

module.exports = checkJwt
