import lodash from 'lodash';
import { resSuccess, resErrorNotFoundObject } from '../helpers/http_handler.helper.js';

export default class BaseController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.getAllByConditions = this.getAllByConditions.bind(this);
  }

  async getAll(req, res, next) {
    await this.Model.findAll(req.query)
      .then(rows => resSuccess(res, rows))
      .catch(e => next(e));
  }

  async getAllByConditions(req, res, next) {
    const {
      conditions = false,
      sort = false,
      query = {}
    } = req.body;
    await this.Model.findAndCountAll(conditions, sort, query)
      .then(rows => resSuccess(res, rows))
      .catch(e => next(e));
  }

  async getOne(req, res, next) {
    try {
      const objData = await this.Model.findById(req.params.id);
      if (objData) {
        return resSuccess(res, objData);
      }
      return resErrorNotFoundObject(res, req.params.id);
    } catch (e) {
      return next(e);
    }
  }

  async create(req, res, next) {
    const requestData = req.body;
    const currentUser = lodash.get(req, 'user', false);
    this.Model.create(requestData, currentUser)
      .then(savedObject => resSuccess(res, savedObject))
      .catch(e => next(e));
  }

  async update(req, res, next) {
    const requestData = req.body;
    const currentUser = lodash.get(req, 'user', false);
    this.Model.update(req.params.id, requestData, currentUser)
      .then(objData => resSuccess(res, objData))
      .catch(e => next(e));
  }

  async remove(req, res, next) {
    const currentUser = lodash.get(req, 'user', false);
    this.Model.remove(req.params.id, currentUser)
      .then(objData => resSuccess(res, objData))
      .catch(e => next(e));
  }
}
