const {ResponseData} = require('../../helpers/response-data')
const express = require('express')
const router = express.Router()
const userRouter = require('./users-route')
const moonBNBRouter = require('./moonBNB-route')




router.use('/auth',userRouter)
const middleware = require('./../../middleware/auth')
router.use(middleware)
router.use('/service',moonBNBRouter)

router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router