const { Images } = require('../../models/Image')
const e = require('cors')
const { ObjectId } = require('mongoose').Types;
let ImagesServices = {
    UpLoads: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const check = await validateBody(req)
        if (check) {
          return reject(new Error(check))
        }
        const image = req.body.image
        const savedImage = await Images({
            Image: image
          }).save();
          
          const imageId = savedImage._id; 
          return resolve(`http://14.225.204.86/api/v1/client/service/Upload/getqr?id=${imageId}`)
      } catch (e) {
        console.log(e)
        reject(new Error("Erro Get PayLoad"))
      }
    })
  },
  GetQR: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const id = req.query.id
        const filter = { _id: ObjectId(id) };  // Chuyển id thành ObjectId nếu id là string
        const image = await Images.findOne(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    
        if (!image) {
            return res.status(404).send('Image not found');
        }
        // Tạo HTML động với URL lấy được từ MongoDB
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image</title>
            </head>
            <body>
                <h1>QR Cticket</h1>
                <img src="${image.Image}" alt="Image" width="300" />
            </body>
            </html>
        `;

        // Gửi file HTML ra client
        resolve(htmlContent);
      } catch (e) {
        console.log(e)
        reject(new Error("Erro Get qr"))
      }
    })
  },

}

async function validateBody(req) {
  if (!req.body.image) return 'Image invalid'
  return null
}


module.exports = ImagesServices