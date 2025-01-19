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
    <title>QR Payment</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to bottom right, #ffe4b2, #ff9a8b);
            color: #333;
        }

        h1 {
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            font-size: 2rem;
            margin-bottom: 20px;
        }

        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        .lucky-cat {
            margin-bottom: 20px;
            width: 100px;
            height: auto;
        }

        .qr-image {
            border: 5px solid white;
            border-radius: 15px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <img class="lucky-cat" src="https://i.imgur.com/OrD1faj.png" alt="Lucky Cat" />
        <h1>QR Đây Thanh Toán Nhanh Đi!!!!!!!</h1>
        <img class="qr-image" src="${image.Image}" alt="QR Code" width="300" />
    </div>
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