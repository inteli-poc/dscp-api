const express = require('express')
const formidable = require('formidable')

const {
  getLastTokenId,
  getItem,
  runProcess,
  processMetadata,
  validateInputIds,
  validateTokenId,
  getReadableMetadataKeys,
  getMembers,
  containsInvalidMembershipOwners,
  membershipReducer,
  getMetadataResponse,
} = require('../util/appUtil')
const logger = require('../logger')
const { LEGACY_METADATA_KEY, FILE_UPLOAD_MAX_SIZE } = require('../env')

const router = express.Router()

router.get('/last-token', async (req, res) => {
  try {
    const result = await getLastTokenId()
    res.status(200).json({ id: result })
  } catch (err) {
    logger.error(`Error getting latest token. Error was ${err.message || JSON.stringify(err)}`)
    if (!res.headersSent) {
      res.status(500).send(`Error getting latest token`)
    }
  }
})

router.get('/item/:id', async (req, res) => {
  console.log('ITEM ID', req.params.id)

  const id = validateTokenId(req.params.id)

  if (!id) {
    logger.trace(`Invalid id: ${req.params.id}`)
    res.status(400).json({ message: `Invalid id: ${req.params.id}` })
    return
  }

  try {
    const result = await getItem(id)

    result.metadata = getReadableMetadataKeys(result.metadata)

    if (result.id === id) {
      console.log('ITEM ID RESULT', result)

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
})

// legacy route, gets metadata with legacy key
router.get('/item/:id/metadata', async (req, res) => {
  console.log('ITEM ID METADATA', req.params.id, LEGACY_METADATA_KEY, res.body)
  getMetadataResponse(req.params.id, LEGACY_METADATA_KEY, res)
})

router.get('/item/:id/metadata/:metadataKey', async (req, res) => {
  console.log('ITEM ID METADATA METADATAKEY', req.params.id, req.params.metadataKey, res.body)
  getMetadataResponse(req.params.id, req.params.metadataKey, res)
})

router.get('/members', async (req, res) => {
  try {
    const members = await getMembers()
    const membershipMembers = membershipReducer(members)

    res.status(200).json(membershipMembers)
  } catch (err) {
    logger.error(`Error getting members. Error was ${err.message || JSON.stringify(err)}`)
    if (!res.headersSent) {
      res.status(500).send(`Error getting members`)
    }
  }
})

router.post('/run-process', async (req, res) => {
  const form = formidable({ multiples: true, maxFileSize: FILE_UPLOAD_MAX_SIZE })

  form.parse(req, async (formError, fields, files) => {
    try {
      if (formError) {
        logger.error(`Error processing form ${formError}`)
        res.status(500).json({ message: 'Unexpected error processing input' })
        return
      }

      let request = null
      try {
        request = JSON.parse(fields.request)
      } catch (parseError) {
        logger.trace(`Invalid user input ${parseError}`)
        res.status(400).json({ message: `Invalid user input ${parseError}` })
        return
      }

      if (!request || !request.inputs || !request.outputs) {
        logger.trace(`Request missing input and/or outputs`)
        res.status(400).json({ message: `Request missing input and/or outputs` })
        return
      } else if (request.outputs && (await containsInvalidMembershipOwners(request.outputs))) {
        logger.trace(`Request contains invalid owners that are not members of the membership list`)
        res.status(400).json({ message: `Request contains invalid owners that are not members of the membership list` })
        return
      }

      const inputsValid = await validateInputIds(request.inputs)
      if (!inputsValid) {
        logger.trace(`Some inputs were invalid`)
        res.status(400).json({ message: `Some inputs were invalid: ${JSON.stringify(request.inputs)}` })
        return
      }

      const outputs = await Promise.all(
        request.outputs.map(async (output) => {
          //catch legacy single metadataFile
          if (output.metadataFile) {
            output.metadata = { [LEGACY_METADATA_KEY]: { type: 'FILE', value: output.metadataFile } }
          }
          try {
            return {
              owner: output.owner,
              metadata: await processMetadata(output.metadata, files),
            }
          } catch (err) {
            logger.trace(`Invalid metadata: ${err.message}`)
            res.status(400).json({ message: err.message })
            return
          }
        })
      )
      const result = await runProcess(request.inputs, outputs)

      if (result) {
        console.log('RUN PROCESS RESULT', result)
        res.status(200).json(result)
      } else {
        logger.error(`Unexpected error running process ${result}`)
        res.status(500).json({
          message: `Unexpected error processing items`,
        })
      }
    } catch (err) {
      logger.error(`Error running process. Error was ${err.message || JSON.stringify(err)}`)
      if (!res.headersSent) {
        res.status(500).send(`Error running process`)
      }
    }
  })
})

module.exports = router
