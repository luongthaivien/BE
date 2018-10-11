/* eslint camelcase: 0 */
/* eslint no-case-declarations: 0 */

import MongoDBBaseModel from './../base/mongo.base.model.js';
import ActivitySC from './schemas/activity.schema';

class ActivityModel extends MongoDBBaseModel {
  constructor() {
    super(ActivitySC, 'Activities');
  }

  async create(objData) {
    if (typeof this.beforeCreate === 'function') {
      await this.beforeCreate(objData);
    }
    return await objData.save();
  }
}

export default new ActivityModel();
