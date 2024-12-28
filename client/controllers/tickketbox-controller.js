const { ResponseData } = require('../../helpers/response-data')
const userService = require('../services/user-service.js')

class TicketBoxController {
  async registerUser(req, res) {
    try {
      const response = await userService.registerUser(req)
      if (response)      
        return res.json(new ResponseData(true, 'Dang ky thanh cong').toJson())
      return res.json(new ResponseData(false, 'Dang ky that bai').toJson())
    } catch (err) {
      console.log(Date.now())
      console.log(err)
      res.json(new ResponseData(false, err.message).toJson())
    }
  }
  async login(req, res) {
    try {
      const response = await userService.LoginUser(req,res)
      if (response)      
        return res.json(new ResponseData(true, 'login thanh cong',response).toJson())
      return res.json(new ResponseData(false, 'login that bai').toJson())
    } catch (err) {
      console.log(Date.now())
      console.log(err)
      res.json(new ResponseData(false, err.message).toJson())
    }
  }
  async getOrderUser(req, res) {
    try {
      const response = await userService.getUserInfo(req)
      if (response)      
        return res.json(new ResponseData(true, 'Get user thanh cong', response).toJson())
      return res.json(new ResponseData(false, 'Get user that bai').toJson())
    } catch (err) {
      console.log(Date.now())
      console.log(err)
      res.json(new ResponseData(false, err.message).toJson())
    }
  }

  
}

module.exports = new UserController