const { Users } = require('../../models/Users')
const express = require('express');
const ROLE = require('../../models/enum/role')
const jwt = require('jsonwebtoken')
// const bcrypt = require("bcrypt")
const config = require('../../config/config')
// const http = require('../../http/http-client')
const { ResponseData } = require('../../helpers/response-data')

let userService = {
  registerUser: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const check = await validateBody(req)
        if (check) {
          return reject(new Error(check))
        }

        const keyPc = req.body.keyPc
        const filter = { 'keyPc': keyPc }
        const user = await Users.findOne(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (user) return reject(new Error("key da ton tai"))
        const role = ROLE.USER
        await Users({
          keyPc: keyPc,
          role: role,
          point:0
        }).save()
        return resolve(true)
      } catch (e) {
        console.log(e)
        reject(new Error("Loi khi tao tai khoan"))
      }
    })
  },

  LoginUser: async function (req,res) {
    return new Promise(async function (resolve, reject) {
      try {
        const keyPc = req.body.keyPc
        let user = await getUser(keyPc)
        if (!user) {
          return res.status(401).json(new ResponseData(false, "User name do not exist",).toJson())
        }
        const id = user._id.toString()
        const tokens = generateTokens({ id, keyPc })
        const response = await Users.findOneAndUpdate({ keyPc: keyPc }, { refreshToken: tokens.refreshToken,accessToken: tokens.accessToken })
        let userInfo = await Users.findOne({ _id: user._id }, { passWord: 0, __v: 0, createdAt: 0, updatedAt: 0, refreshToken: 0 })
        return resolve({  tokens })
      } catch (e) {
        console.log(e)
        reject(new Error("Loi khi dang nhap"))
      }
    })
  }, LogoutUser: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const userId = req.body.userId
        const response = await Users.findOneAndUpdate({ _id: userId }, { refreshToken: null })
        resolve(true)

      } catch (e) {
        console.log(e)
        reject(new Error("Loi logout"))
      }
    })
  },
  Token: async function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) reject(false)
        const user = await Users.findOne({ refreshToken: refreshToken })
        if (!user) reject(false)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const tokens = generateTokens(user._id, user.userName)
        const response = await Users.findOneAndUpdate({ userName: user.userName }, { refreshToken: tokens.refreshToken })
        return resolve(tokens)
      } catch (e) {
        console.log(e)
        reject(new Error("Loi Token"))
      }
    })
  },
  
  async getUserInfo(req) {
    try {
      return new Promise((resolve, reject) => {
        Users.findOne({ keyPc: req.body.keyPc }, (err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

}

async function validateBody(req) {
  if (!req.body.keyPc) return 'Nhap thieu key'
  return null
}
async function getUser(keyPc) {
  try {
      return new Promise((resolve, reject) => {
          Users.findOne({ keyPc: keyPc }, (err, data) => {
              if (err) return reject(err)
              return resolve(data)
          })
      })
  } catch (e) {
      console.log(e)
      throw e
  }
}
function generateTokens(payload) {
  const { id, keyPc } = payload
  // Create JWT

  const accessToken = jwt.sign(
    { id, keyPc },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '30m'
    }
  )

  const refreshToken = jwt.sign(
    { id, keyPc },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d'
    }
  )

  return { accessToken, refreshToken }
}
function validateUser(hash) {
  return new Promise(async function (resolve, reject) {
    bcrypt
      .compare(password, hash)
      .then(res => {
        console.log(res)
        return resolve(res) // return true
      })
      .catch(err => reject(err))
  })
}
module.exports = userService