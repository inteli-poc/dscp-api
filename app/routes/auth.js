const express = require('express')
const fetch = require('node-fetch')
const { AUTH_AUDIENCE, AUTH_TOKEN_URL } = require('../env')
const logger = require('../logger')

const router = express.Router()

router.post('/', async (req, res) => {
  if (!req.body || !req.body.client_id || !req.body.client_secret) {
    res.status(400).send({ error: '"client_id" and "client_secret" fields required' })
    return
  }

  try {
    const response = await fetch(AUTH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        audience: AUTH_AUDIENCE,
      }),
    })
    const data = await response.json()
    if (response.status === 200) {
      res.status(200).json(data)
    } else {
      logger.error(`Auth0 error: ${data.error_description}`)
      res.status(response.status).send(data)
    }
  } catch (err) {
    logger.error('Error:', err.message)
    res.status(500).send(`Error: ${err}`)
  }
})

module.exports = router
