import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import { assign } from 'lodash'

import config from '../../../initial/config'
import { expiresIn } from '../../../initial/constant'
import { resSuccess, resError } from '../../helpers/http_handler.helper.js'
import { removePrivateAttb } from '../../helpers/base.helper'

import Pattern from '../../helpers/regexValidate'

import MongoDBBaseModel from '../../models/base/mongo.base.model'
import usersModel from '../../models/idModel/usersModel'


const userModel = new MongoDBBaseModel(usersModel, 'users')

export default class AuthController {
  static async login (req, res) {
    try {
      userModel.findOne({ email: req.body.username },
        (err, data) => {
          if (data) {
            const isLogin = true
            if (isLogin) {
              const token = jwt.sign({
                user_id: data._id
              }, config.jwt_secret, { expiresIn })
              const rs = Object.assign({ email: data.email, _id: data._id }, { token })
              console.log(rs)
              return resSuccess(res, removePrivateAttb(rs))
            }
            return resError(res, {
              code: 400,
              message: 'Incorrect password'
            })
          }
          return resError(res, {
            code: 404,
            message: 'User not found'
          })
        })
    } catch (err) {
      return resError(res, { code: 403, message: 'Forbidden', err })
    }
  }

  /**
   * This is a protected route. Will return random number only if jwt token is provided in header.
   * @param req
   * @param res
   * @returns {*}
   */
  static getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
      user: req.user,
      num: Math.random() * 100
    })
  }

  async register(req, res, next) {
    const requestData = req.body
    const validEmail = requestData.email !== '' && requestData.email.match(Pattern.email) != null
    const validPassword = requestData.password !== '' && requestData.password.length > 6

    const salt = bcryptjs.genSaltSync(10)
    requestData.password = bcryptjs.hashSync(requestData.password, salt)

    const msg = []

    if (requestData.username.length < 6) {
      msg.push('Username phải có 6 ký tự trở lên')
    }

    if (!validPassword) {
      msg.push('Password phải có 6 ký tự trở lên')
    }

    if (!validEmail) {
      msg.push('Email không đúng định dạng')
    }

    if (msg.length == 0) {
      userModel.findOne({ email: requestData.email }, (err, data) => {
        if (!data) {
          userModel.create(requestData)
            .then(savedObject => resSuccess(res, savedObject))
            .catch(e => next(e))
        } else {
          resError(res, { msg: ['Tài khoản này đã đăng ký'] })
        }
      })
    } else {
      resError(res, { msg })
    }
  }
}
