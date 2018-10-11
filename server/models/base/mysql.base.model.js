import lodash from 'lodash';
import CommonInterface from './common.interface';
import MySQLConnection from '../connections/mysql.connection';
import RedisConnection from '../connections/redis.connection';
import { privateFields } from '../../../initial/constant';
import * as baseHelper from '../../helpers/base.helper.js';

const transformSort = sortMongo =>
  Object.keys(sortMongo).map((key) => {
    const sort = sortMongo[key] === 1 ? 'ASC' : 'DESC';
    return [
      key,
      sort
    ];
  });
export default class MySQLBaseModel extends CommonInterface {
  constructor(tableName, schema, cachePrefix = 'mysql') {
    super();
    const addOnOption = {
      comment: `This is ${tableName} table`,
      engine: 'MYISAM',
      timestamps: true,
      createdAt: '_created_at',
      updatedAt: '_updated_at',
      deletedAt: '_deleted_at',
      paranoid: true,
      freezeTableName: true
    };
    this.cachePrefix = cachePrefix;
    const sequelize = new MySQLConnection();
    this.sequelizeModel = sequelize.define(tableName, schema, addOnOption);
    this.sequelize = sequelize;
    this.Redis = new RedisConnection();
    this.clearData = this.clearData.bind(this);
  }

  clearData() {
    return this.sequelizeModel.destroy(
      {
        where: {},
        truncate: true,
        force: true,
        cascade: false,
        restartIdentity: true
      });
  }

  create(data, user) {
    let requestData = baseHelper.deleteAttributeInObject(data, Object.keys(privateFields));
    requestData = baseHelper.bindingObjectFromArray(
      {
        _created_by: lodash.get(user, 'id', 0),
        _status: 1,
        _deleted_at: null,
      },
      requestData, Object.keys(this.sequelizeModel.rawAttributes)
    );
    return this.sequelizeModel.create(requestData)
      .then(obj => obj.get({ plain: true }))
      .catch(err => err);
  }

  findOneAndUpdate(where, data) {
    const finalData = baseHelper.bindingObjectFromArray(
      {
        _created_by: lodash.get(data, '_created_by', 0),
        _status: 1,
        _deleted_at: null
      },
      data, Object.keys(this.sequelizeModel.rawAttributes)
    );
    return this.sequelizeModel.insertOrUpdate(finalData, where);
  }

  async update(id, data, user) {
    let requestData = baseHelper.deleteAttributeInObject(data, Object.keys(privateFields));
    requestData = baseHelper.bindingObjectFromArray(
      {
        _updated_by: lodash.get(user, 'id', 0)
      },
      requestData, Object.keys(this.sequelizeModel.rawAttributes)
    );
    await this.sequelizeModel.update(requestData, {
      where: {
        id,
        _deleted_at: null,
        _status: 1
      },
      returning: true
    });
    return await this.findById(id, true);
  }

  async remove(id, user) {
    await this.sequelizeModel.update({
      _deleted_by: lodash.get(user, 'id', 0),
      _updated_by: lodash.get(user, 'id', 0),
      _status: -1
    }, {
      where: {
        id,
        _deleted_at: null
      },
      returning: true
    });
    return await this.sequelizeModel.destroy({ where: { id } });
  }

  findAll(conditions, query, sortOption = { _created_at: -1 }) {
    const skip = lodash.get(query, 'skip', 0);
    const limit = lodash.get(query, 'limit', 10);
    return this.sequelizeModel.findAll({
      where: {
        ...conditions,
        _status: 1,
        _deleted_at: null
      },
      order: transformSort(sortOption),
      offset: skip,
      limit
    });
  }

  getFullList(conditions, sortOption = { _created_at: -1 }) {
    return this.sequelizeModel.findAll({
      where: conditions,
      order: transformSort(sortOption)
    });
  }

  async findAndCountAll(conditions, sort, query) {
    const skip = lodash.get(query, 'skip', 0);
    const limit = lodash.get(query, 'limit', 10);
    const sortOption = sort || { id: -1 };
    const rs = await
      this.sequelizeModel.findAndCountAll({
        where: {
          ...conditions,
          _status: 1,
          _deleted_at: null
        },
        order: transformSort(sortOption),
        offset: skip,
        limit,
        raw: true
      });
    return { total: rs.count, data: rs.rows };
  }

  async rawQuery(query) {
    return await
      this.sequelizeModel.sequelize.query(query);
  }

  async findAndModify(conditions, sortOption, dataUpdate, number) {
    const list = await this.sequelizeModel.findAll({
      where: { ...conditions, _status: 1, _deleted_at: null },
      order: transformSort(sortOption),
      offset: 0,
      limit: number
    });
    if (list.length > 0) {
      return await Promise.all(list.map(obj => this.update(obj.id, dataUpdate)));
    }
    return list;
  }

  findOne(options) {
    return this.sequelizeModel.findOne({ where: { ...options }, raw: true });
  }

  async findById(id, froceFromDB = false) {
    try {
      if (froceFromDB) {
        const detail = await this.sequelizeModel.findById(id, { raw: true });
        this._setCache(detail);
        return detail;
      }
      const cache = await this._getCache(id);
      if (cache) {
        return JSON.parse(cache);
      }
      const detail = await this.sequelizeModel.findById(id, { raw: true });
      this._setCache(detail);
      return detail;
    } catch (err) {
      return false;
    }
  }

  async findByIdFull(id, fields, froceFromDB = false) {
    try {
      if (froceFromDB) {
        const detail = await this.sequelizeModel.findOne({
          where: { id },
          attributes: fields
        }, { raw: true });
        this._setCache(detail);
        return detail;
      }
      const cache = await this._getCache(id);
      if (cache) {
        return JSON.parse(cache);
      }
      const detail = await this.sequelizeModel.findOne({
        where: { id },
        attributes: fields
      }, { raw: true });
      this._setCache(detail);
      return detail;
    } catch (err) {
      return false;
    }
  }

  count(...options) {
    return this.sequelizeModel.count(...options);
  }
}

