const {ResponseData} = require('../../helpers/response-data')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.post('/register',userController.registerUser)
router.post('/login',userController.login)


router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router