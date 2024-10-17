const { ResponseData } = require('../../helpers/response-data')
const BlumServices = require('../services/Blums-service.js')

class BlumController {
 
  async getPayload(req, res) {
    try {
      const response = await BlumServices.GetPayLoad(req)
      if (response)      
        return res.json(new ResponseData(true, 'Get payload thanh cong', response).toJson())
      return res.json(new ResponseData(false, 'Get payload that bai').toJson())
    } catch (err) {
      console.log(Date.now())
      console.log(err)
      res.json(new ResponseData(false, err.message).toJson())
    }
  }

  
}

module.exports = new BlumController