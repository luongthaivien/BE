/* eslint no-console: 0 */
/* eslint no-loop-func: 0 */
// import Promise from 'bluebird';

export const limitPromise = async(arr, limit, proms, ...args) => {
  let start = 0;
  while (start <= arr.length) {
    const end = start + limit;
    const tmpArr = arr.slice(start, end);
    for (let i = 0; i < tmpArr.length; i += 1) {
      const currentObject = tmpArr[i];
      await proms(currentObject, ...args);
    }
    start += limit;
  }
};

export const limitPromiseWithReturn = async(arr, limit, proms, ...args) => {
  const rsReturn = [];
  let start = 0;
  while (start <= arr.length) {
    const end = start + limit;
    const tmpArr = arr.slice(start, end);
    for (let i = 0; i < tmpArr.length; i += 1) {
      const currentObject = tmpArr[i];
      const rs = await proms(currentObject, ...args);
      rsReturn.push(rs);
    }
    start += limit;
  }
  return rsReturn;
};
export const interatePromise = async(arr, limit, proms) => {
  let start = 0;
  const returnData = {};
  while (start <= arr.length) {
    const end = start + limit;
    const tmpArr = arr.slice(start, end);
    for (let i = 0; i < tmpArr.length; i += 1) {
      const currentObject = tmpArr[i];
      await proms(returnData, currentObject);
    }
    start += limit;
  }
  return returnData;
};
/*
 Usage :
 limitPromise(
 items,
 2,
 item => new Promise((resolve, reject) => {
 setTimeout(() => {
 console.log(item);
 resolve(item);
 }, 2000);
 })
 );
 */
