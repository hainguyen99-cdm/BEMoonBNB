const {ResponseData} = require('../../helpers/response-data')
const express = require('express')
const router = express.Router()
const userRouter = require('./users-route')
const moonBNBRouter = require('./moonBNB-route')
const blumRouter = require('./blum-route')
const ImagesRouter = require('./images-route')



const middleware = require('./../../middleware/auth')

router.use('/service/Upload',ImagesRouter)
router.use('/auth',userRouter)
router.use(middleware)
router.use('/service/moonbnb',moonBNBRouter)
router.use('/service/moonbnb',moonBNBRouter)




router.use('/', (req, res) => {
  return res.status(404).json(new ResponseData(false, "Not found").toJson())
})

module.exports = router