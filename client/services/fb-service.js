const httpclient = require("../../http/http-client")
const fs = require('fs')
const logger = require('../../helpers/logger')('facebookService')
const { Orders } = require('../../models/orders')
const { Worker } = require('worker_threads')

let facebookService = {
  test: async function(req) {
    return new Promise(async function(resolve, reject) {
      const idLive = req.body.idLive
      const soMatCanBuff = req.body.soMatCanBuff
      const index = req.body.index
      
      const workerData = {idLive: idLive, soMatCanBuff: soMatCanBuff, index: index}
      const worker = new Worker( __dirname + '/buffmat-thread.js', { workerData: workerData });

      worker.on('message', (value) => {
        console.log(Date.now())
        console.log(value)
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`stopped with  ${code} exit code`));
      });
      resolve(true)
    })
  },
  buffmat: async function(idOrder) {
   return new Promise(async function(resolve, reject) {
      try {
        const filter = {'_id': idOrder}
        const responseLive = await Order.findOne(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (!responseLive) return resolve(false)
        return resolve(true)
      } catch (e) {
        console.log(e)
        console.log(logger(e))
        return resolve(false)
      }
    })
  },
  addLive: async function(req) {
    return new Promise(async function(resolve, reject) {
      try {
        console.time('LOG_TIME');
        await Live({
          idLive: '123123123',
          status: 'RUNNING',
          soMatHienTai: 10,
          soMatCanBuff: 100
        }).save()
        resolve({
          'status': 'true',
        })
        console.timeEnd('LOG_TIME');
      } catch (e) {
        console.log(e)
        console.log(logger(e))
      }
    })
  },
}

function test(params, params1) {
  console.log('params')
  console.log(params.a)
  console.log(params.b)
}

function sleep(ms) {
  return new Promise((resole) => {
    setTimeout(resole, ms)
  })
}

module.exports = facebookService