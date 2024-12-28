const httpclient = require("../../http/http-client")
const fs = require('fs')
const logger = require('../../helpers/logger')('facebookService')
const { Live } = require('../../models/live')
const { parentPort, workerData } = require('worker_threads')
const http = require('../../http/http-client')

main()

async function main() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('====== main ======')
      
      // let fb_dtsg = await getFbDtsg("cookie", 0)
      console.log(`============ idLive ${workerData.idLive} - so mat ${workerData.soMatCanBuff}=================`)
      logicLive(workerData.soMatCanBuff, workerData.idLive, workerData.index)
      // logicLive(1, "1382931222289664", 0)
      resolve(true)
    } catch (e) {
      console.log(e)
      console.log(logger(e))
      return resolve(false)
    }
  })
}

async function logicLive(soMatCanBuffTong, idLive, index) {
  console.log('========= logicLive =========')
  var listCookie = await readFile("uploads/cookie.txt")
  let soMatBuffHienTai = soMatCanBuffTong
  do {
    const soMatThanhCong = await xuLyBuff(listCookie, soMatBuffHienTai, idLive, index)
    soMatBuffHienTai = soMatBuffHienTai - soMatThanhCong // bu mat con thieu
  } while (soMatBuffHienTai > 0)
  parentPort.postMessage('success')

}

async function xuLyBuff(listCookie, soMatCanBuff, idLive, index) {
  console.log('========= xuLyBuff =========')
  return new Promise(async (resolve, reject) => {
    try {
      let soMatThanhCong = 0
      let demChayXong = 0
      for (let i = index; i < soMatCanBuff; i++) {
        viewLive(listCookie[i].trim(), idLive, i).then((value) => {
          demChayXong++
          if (value) {
            soMatThanhCong++
            if (soMatThanhCong >= soMatCanBuff) {
              console.log('------ chay xong xuLyBuff  ------' + soMatThanhCong)
              return resolve(soMatThanhCong)
            }
          }
        }).catch((err) => {
          demChayXong++
        })
      }
    } catch (e) {
      console.log(e)
      return resolve(1000000)
    }
  })
}


function tachCookie(cookie) {
  let temp = cookie.split(';')
  let data = {}
  for (let i = 0; i < temp.length; i++) {
    temp1 = temp[i].split('=')
    //console.log(temp1)
    data[temp1[0].trim()] = temp1[1]
  }
  return data
}

function randomBetween(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

async function getLinkDtsg() {
  return new Promise(async function (resolve, reject) {
    try {
      const url = "http://localhost:3000/api/v1/admin/linkdtsg"
      const response = await http.get(url, {}, {})
      return resolve(response.data.data.link)
    }
    catch (e) {
      return reject(e)
    }
  })
}


function getFbDtsg(cookie, index) {
  return new Promise(async (resolve, reject) => {
    try {
      let headers = {
        'Cookie': cookie,
      }
      const url = await getLinkDtsg()
      let response = await httpclient.get(url, {}, headers)
      let string = response.data
      let regex = /name="fb_dtsg" value=".*?"/g
      let result = string.match(regex)
      if (!result || result.length == 0) return reject()
      let value = result[0].split('\"')
      return resolve(value[3])
    } catch (e) {
      console.log(` ==== getFbDtsg    error    ==== ${index}`)
      console.log(e)
      return reject(e)
    }
  }
)}

function viewLive(cookie, idlive, index) {
  return new Promise(async function (resolve, reject) {
    console.log(`viewLive -- ${index}`)
    const url = 'https://www.facebook.com/video/unified_cvc/'
    try {
      let dataCookie = tachCookie(cookie)
      let fb_dtsg = await getFbDtsg(cookie, index)
      // let fb_dtsg ="NAcNWUfXnCAN-TkeJ5sF1L4DxNooq6TF3v2zDglHF2YScvVcHyh1ftg:19:1683665655"
      console.log('=== fb_dtsg ====')
      console.log(fb_dtsg)
      const num1 = randomBetween(1000, 99999)
      const num2 = randomBetween(100000, 999999)
      let c_user = dataCookie.c_user
      const formData = new URLSearchParams();
      formData.append('d', '{"pps":{"m":false,"pf":17,"s":"playing","sa":8091532},"ps":{"m":false,"pf":4324,"s":"playing","sa":8091532},"si":"f6b6b3e3c3ea8c","so":"tahoe::topic_live","vi":"'+idlive+'","tk":"kiRURzqx6K3gNB7BMaFF8F7eZuhW6qC1dP3tvaigOtIK+L1eT8QTxOIFgLKeGEkANTqclFAd3/tZPobtEmqAKQ==","ls":true}');
      formData.append('__user', c_user);
      formData.append('__a', '1');
      formData.append('__req', '1u');
      formData.append('__hs', '19536.HYP:comet_pkg.2.1..2.1');
      formData.append('dpr', '1');
      formData.append('__ccg', 'EXCELLENT');
      formData.append('__rev', '1007762999');
      formData.append('__s', 'q6zcq1:c5ujct:yyysj0');
      formData.append('__hsi', '7249799531241110699');
      formData.append('__dyn', '7AzHJ16UW5A9Uvxt0mUyEqxd4WobVo66u2i5U4e2C17yUJ3odF8iz8K2aewnof8boG4E762S1ixi3y4o27wxg5O0BU2_CxS320om78-7bwto88422y11xmfz822wtU4a3a4oaEnxO0Bo4O2-2l2Utwwg4u2O1RxW1axe3S7Udo5qfK0zEkxe2GexeeDwkUtxGm2SUbElxm3y3aexfxmu3W3rwxwhFVovUy2a0SEuBwFKq2-azqwqoG3C223908O3216xi4UdUcojxK2B0LwNwJwxyo566k1Fw');
      formData.append('__csr', 'gacIt4gBN4rb4ijcAlv6OkxWcz9PsIiIZih7lsk-JR6uR-yFkZitnWHQC9lWAPZZAQJrcIBajGuCrLGumjKGCAASRQG-XWAJ4AHFrJunoCCK8V59DykrJaF-mZa-EySCHJWjCqoLADmVVUil3uiF9puiQ4aAXKVHKiaKi4BHyVpriRmi9zry-ibXUWm5-qle9y9-mEDyUKUKleEW22up4y99oWjCQ8WGdx3wECCCAAhQ5Uiz9oK27AVohxemEbQFHCg8Fbyob8kyoOiiUgzEiDDxGHCDDyFEty8szEmwVwHDxKeHyQ4aVUnyp48AxamAUG2qEbGzEC9xd3o8UqybByE4mu4oiByUoyohxi2q49U0cc65U4V0kok40368663a09Ml0qo1hA0qYB05iw7pw32o1hQ1Ew1qa1UzU0fNE0sUwdi0fXxiq0eDw1Hq05oE4i0kO0jufxy0H86S0E9m1nxa1DF0zs-q4Ceqx5AR9sp40jRDCs8Qb8681o8ciUGQqm0O8bEfEeE1BEe81FQ0T80Ky1zxK8U0h9zaAG0Lm1cCm0dxwj62B0po525E3MgdUiwyz8xw6ewtag7609QwjU6m1gxkw0Zefw7jw3hFYWx50Oxac80oG2m4o1cpZAzE0gpwd38tAwEDw0wJiDwpo0V-V6887U7q0GU18FBc09WUumKQC9Cwq81KE2ny40xo2Hw2TsOw8C8whUy0OUdo');
      formData.append('__comet_req', '15');
      formData.append('fb_dtsg',fb_dtsg );
      formData.append('jazoest', '25454');
      formData.append('lsd', 'MBdF-MIWQDrNSjy1VAtadA');
      formData.append('__spin_r', num1);
      formData.append('__spin_b', 'trunk');
      formData.append('__spin_t', num2);
      let options = {
        headers: {
          'Cookie': cookie,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
        }
      }
      let response = await httpclient.post(url, formData, options)
      let view = JSON.parse(JSON.parse(JSON.stringify(response.data.substring(9, response.data.length))))
      let status = view.payload.d.bs
      let mat = view.payload.d.c
      console.log(`Cookie ${index} --- view: ${mat} ---- status: ${status}`)
      return resolve({
        'view': index,
        'status_live': 'OFF',
      })
    } catch (e) {
      console.log(e)
      console.log(`Cookie ${index} --- error`)
      return resolve(false)
    }
    // setTimeout(function () {
    //   console.log(`Cookie ${index} --- error`)
    //   return resolve({
    //     'status': 'ERROR',
    //   })
    // }, 5000)
  })
}

async function readFile(file) {
  console.log('========= readFile =========')
  return new Promise(async (resolve, reject) => {
    fs.readFile(file, 'utf8', function (err, data) {
      const arr = data.split('\n')
      //console.log(arr)
      return resolve(arr)
    })
  })
}

function sleep(ms) {
  return new Promise((resole) => {
    setTimeout(resole, ms)
  })
}