import mongoose from 'mongoose';
import _ from 'lodash';
import { privateFields } from '../../../../initial/constant';
import { incrementID } from '../courtersModel';

class BaseSchema extends mongoose.Schema {
  constructor(objSchema) {
    // objSchema.obj._id = 1;
    objSchema = Object.assign(objSchema.obj, privateFields);
    _.reverse(objSchema.obj)
    super(objSchema);

    /**
     * Add your
     * - pre-save hooks
     * - validations
     * - virtuals
     */

    /**
     * Methods
     */
    this.method({});
    /**
     * Statics
     */
    this.statics = {
      findAndModify(query, sort, doc, options, callback) {
        return this.collection.findAndModify(query, sort, doc, options, callback);
      },
      list(conditions, sort = { _created_at: -1 }, skip = 0, limit = 10) {
        return this.find(conditions)
          .sort(sort)
          .skip(+skip)
          .limit(+limit)
          .exec();
      },
      // /**
      //  * List objs in descending order of 'createdAt' timestamp.
      //  * @param {number} skip - Number of objs to be skipped.
      //  * @param {number} limit - Limit number of objs to be returned.
      //  * @param {object} sort - sorting.
      //  * @param {object} conditions - condition.
      //  * @returns {Promise<obj[]>}
      //  */
      listAll(conditions, sort = { _created_at: -1 }) {
        return this.find(conditions)
          .sort(sort)
          .exec();
      }
    };
  }
}

export default BaseSchema;