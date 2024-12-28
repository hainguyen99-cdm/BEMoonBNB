const {ResponseData} = require('../../helpers/response-data')
const express = require('express')
const router = express.Router()
const UploadImagesController = require('../controllers/UploadImages-Controller')

router.post('/upload',UploadImagesController.UpLoads)
router.get('/getqr',UploadImagesController.GetQR)


router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router