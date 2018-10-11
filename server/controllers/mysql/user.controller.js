import BaseController from './../base.controller.js';
import { resSuccess, resErrorNotFoundObject } from '../../helpers/http_handler.helper.js';
import usersModel from '../../models/idModel/usersModel';

export default class UserController extends BaseController {
  constructor() {
    super();
    this.Model = usersModel;
    this.load = this.load.bind(this);
    this.get = this.get.bind(this);
  }

  async getDetails(req, res, next) {
    try {
      const objData = await usersModel.getDetail(req.params.id);
      if (objData) {
        return resSuccess(res, objData);
      }
      return resErrorNotFoundObject(res, req.params.id);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Load user and append to req.
   */
  async load(req, res, next, id) {
    try {
      req.user = await usersModel.findById(id);
      next();
    } catch (e) {
      next(e);
    }
  }

  /**
   * Get user
   * @returns {User}
   */
  async get(req, res) {
    return res.json(req.user);
  }
}
