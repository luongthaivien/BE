import lodash from 'lodash';
import { io } from '../../../index';
import { resSuccess, resError } from '../../helpers/http_handler.helper.js';
import BaseController from '../base.controller';
import { sendToRoomIncludingSender } from '../../services/socket/common.action';
import ActivityModel from '../../models/mongodb/activity.model';

export default class ActivityController extends BaseController {

  constructor() {
    super();
    this.Model = ActivityModel;
  }

  async create(req, res) {
    try {
      const currentUser = lodash.get(req, 'user', false);
      const requestData = req.body;
      const activityObject = await ActivityModel.create(requestData, currentUser);
      sendToRoomIncludingSender({
        io,
        room: 'room-name',
        chanel: 'newActivity',
        msg: activityObject
      });
      // io.emit('newActivity', activityObject);
      return resSuccess(res, activityObject);
    } catch (err) {
      return resError(res, err);
    }
  }

}
