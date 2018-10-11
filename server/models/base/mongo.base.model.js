import Promise from 'bluebird';
import lodash from 'lodash';
import CommonInterface from './common.interface';
import BaseSchema from '../mongodb/schemas/base.schema.js';
import MongoDBConnection from '../connections/mongodb.connection';
import RedisConnection from '../connections/redis.connection';
import { incrementID } from '../mongodb/courtersModel';
import { privateFields } from '../../../initial/constant';
import * as baseHelper from '../../helpers/base.helper.js';

export default class MongoDBBaseModel extends CommonInterface {
  constructor(schema, name, cachePrefix = 'mongo') {
    super();
    this.cachePrefix = cachePrefix;
    const Mongoose = new MongoDBConnection();
    // this.Redis = new RedisConnection();
    const Schema = new BaseSchema(schema);
    this.schema = Schema;
    this.MongooseModel = Mongoose.model(name, this.schema);

    /* Binding method to this */
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.findById = this.findById.bind(this);
    this.count = this.count.bind(this);
    this.findOneAndUpdate = this.findOneAndUpdate.bind(this);
    this.findAndCountAll = this.findAndCountAll.bind(this);
    this.findAndModify = this.findAndModify.bind(this);
    this.getFirst = this.getFirst.bind(this);
    this._updateBase = this._updateBase.bind(this);
  }

  async create(data, user) {
    // let requestData = baseHelper.deleteAttributeInObject(data, Object.keys(privateFields));
    // requestData = baseHelper.bindingObjectFromArray(
    //   {
    //     _created_by: 'ssss',
    //     _status: 1
    //   },
    //   requestData, Object.keys(this.Schema.paths)
    // );
    const objData = new this.MongooseModel(data);
    if (typeof this.beforeCreate === 'function') {
      await this.beforeCreate(objData);
    }
    var id = await incrementID('users');
    objData._id = id.sequence_value;
    return await objData.save();
  }

  async update(id, data, user) {
    let requestData = baseHelper.deleteAttributeInObject(data, Object.keys(privateFields));
    requestData = baseHelper.bindingObjectFromArray(
      {
        _updated_by: lodash.get(user, 'id', 0)
      },
      requestData, Object.keys(this.Schema.paths)
    );
    if (typeof this.beforeUpdate === 'function') {
      await this.beforeUpdate(requestData);
    }
    return await this._updateBase({ _id: id, _status: 1 }, requestData);
  }

  remove(id, user) {
    return this._updateBase({ _id: id }, {
      _status: -1,
      _deleted_at: new Date(),
      _deleted_by: lodash.get(user, 'id', 0)
    });
  }

  findAll(cb) {
    this.MongooseModel.find({}, (e, data) => {
      cb(data);
    });
  }

  async findAndCountAll(conditions, sort, query) {
    const sortOption = sort || { _id: -1 };
    const skip = lodash.get(query, 'skip', 0);
    const limit = lodash.get(query, 'limit', 10);
    const [total, data] = await Promise.all([
      this.count(conditions).then(num => num),
      this.MongooseModel.list(
        {
          ...conditions,
          _status: 1
        },
        sortOption,
        skip,
        limit
      ).then(rs => rs)
    ]);
    return {
      total,
      data
    };
  }

  getFullList(conditions) {
    return this.MongooseModel.listAll({ ...conditions, _status: 1 });
  }

  findOne(conditions, cb) {
    return this.MongooseModel.findOne({ ...conditions, _status: 1 }, cb);
  }

  async findById(id, forceDB = false) {
    try {
      if (forceDB) {
        const addonOption = { _id: id, _status: 1 };
        const detail = await this.MongooseModel.findOne(addonOption);
        this._setCache(detail);
        return detail;
      }
      const cache = await this._getCache(id);
      if (cache) {
        return this.MongooseModel.hydrate(baseHelper.bindingObjectFromArray(
          {},
          JSON.parse(cache),
          Object.keys(this.Schema.paths))
        );
      }
      const addonOption = { _id: id, _status: 1 };
      const detail = await this.MongooseModel.findOne(addonOption);
      this._setCache(detail);
      return detail;
    } catch (err) {
      return false;
    }
  }

  count(conditions) {
    return this.MongooseModel.find({ ...conditions, _status: 1 }).count();
  }

  findOneAndUpdate(conditions, update, options) {
    return new Promise(
      (resolve, reject) =>
        this.MongooseModel.findOneAndUpdate(
          conditions,
          update,
          options,
          (err, object) => {
            if (err) {
              reject(err);
            } else {
              resolve(object);
            }
          })
    );
  }

  findAndModify(query, sort, doc, options) {
    return new Promise((resolve, reject) => this.MongooseModel.findAndModify(
      query, // query
      sort,  // sort order
      { $set: doc }, // replacement
      options, // options
      (err, object) => {
        if (err) {
          reject(err);
        } else {
          resolve(object.value);
        }
      })
    );
  }

  async getFirst(conditions, sort) {
    const result = await this.findAll(conditions, sort, 0, 1);
    return result[0];
  }

  _updateBase(conditions, data) {
    return new Promise((resolve, reject) => this.MongooseModel.findOne(conditions)
      .then((objData) => {
        objData = Object.assign(objData, data);
        return objData.save()
          .then((savedObject) => {
            this._setCache(savedObject);
            resolve(savedObject);
          })
          .catch(e => reject(e));
      })
      .catch(e => reject(e))
    );
  }
}
