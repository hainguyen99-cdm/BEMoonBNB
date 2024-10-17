const {ResponseData} = require('../../helpers/response-data')
const express = require('express')
const router = express.Router()
const BlumController = require('../controllers/Blum-controller')

router.post('/getpayload',BlumController.getPayload)
router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router