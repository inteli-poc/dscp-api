const express = require('express')
const router = express.Router()

const { API_VERSION } = require('../env')

router.get('/', async (req, res) => {
  res.status(200).json({ status: 'ok', version: API_VERSION })
})

module.exports = router
