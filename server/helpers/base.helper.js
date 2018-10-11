import lodash from 'lodash';
import mongoose from 'mongoose';
import { privateFields } from '../../initial/constant';

export const bindingObjectFromArray = (objSource, data, keys) => {
  if (data instanceof Object) {
    keys.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        objSource[prop] = data[prop];
      }
    });
  }
  return objSource;
};
export const deleteAttributeInObject = (objSource, keys) => {
  if (objSource instanceof Object) {
    keys.forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(objSource, prop)) {
        delete objSource[prop];
      }
    });
  }
  return objSource;
};
export const uniqBy = (a, key) => {
  const seen = new Set();
  return a.filter((item) => {
    const k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
};
export const intersectArrayClientAndUser = (listClients,
                                            listUser) => listClients.filter(
  x => (
    listUser.filter(y => y.id === x.user_id)
  )
);
export const inArray = (element, arr) => {
  const length = arr.length;
  for (let i = 0; i < length; i += 1) {
    if (arr[i] === element) return true;
  }
  return false;
};
export const distinctArrayClientFromUserList = (listClients,
                                                listUser) => listClients
  .filter(c => (
    lodash.find(listUser, u => u.id === c.userId) !== undefined)
  );
export const checkVar = variable => (typeof variable !== 'undefined' && variable);

export const removePrivateAttb = (objectData) => {
  const keys = Object.keys(privateFields);
  if (keys.length && keys.length > 0) {
    return deleteAttributeInObject(objectData, keys.concat([
      '_created_at',
      '_updated_at',
      '_deleted_at'
    ]));
  }
  return objectData;
};
