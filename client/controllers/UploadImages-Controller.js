const { ResponseData } = require('../../helpers/response-data')
const ImagesServices = require('../services/Image-service.js')

class UploadImagesController {
 
  async UpLoads(req, res) {
    try {
      const response = await ImagesServices.UpLoads(req)
      if (response)      
        return res.json(new ResponseData(true, 'Upload Image thanh cong', response).toJson())
      return res.json(new ResponseData(false, 'Upload Image that bai').toJson())
    } catch (err) {
      console.log(Date.now())
      console.log(err)
      res.json(new ResponseData(false, err.message).toJson())
    }
  }
  async GetQR(req, res) {
    try {
      const htmlContent = await ImagesServices.GetQR(req);  // Lấy nội dung HTML từ service
      
      if (htmlContent) {
        return res.send(htmlContent);  // Gửi nội dung HTML ra client
      }
      
      return res.status(404).json(new ResponseData(false, 'Image not found').toJson());
    } catch (err) {
      console.log(Date.now());
      console.log(err);
      return res.json(new ResponseData(false, err.message).toJson());
    }
  }

  
}

module.exports = new UploadImagesController