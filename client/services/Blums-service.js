
const BlumPayload = require('./Blum')
const e = require('cors')

let BlumServices = {
  GetPayLoad: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const check = await validateBody(req)
        if (check) {
          return reject(new Error(check))
        }
        const idGame = req.body.idGame
        let payload = await BlumPayload.u(idGame)
        return resolve(payload)
      } catch (e) {
        console.log(e)
        reject(new Error("Erro Get PayLoad"))
      }
    })
  },

}

async function validateBody(req) {
  if (!req.body.idGame) return 'idGame invalid'
  return null
}


module.exports = BlumServices