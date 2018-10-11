/* eslint no-console: 0 */
/* eslint no-continue: 0 */
/* eslint no-restricted-syntax: 0 */
import XLSX from 'xlsx';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import Promise from 'bluebird';
import { pad } from './string.helper';

export const getRootFolderAbsolute = () => path.resolve(path.join(__dirname, '../../'));

export const createDirPromise = dirName => (new Promise((resolve, reject) => {
  mkdirp(dirName, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(dirName);
    }
  });
}));


export const joinDirAndCreteIfNotExist = async (dirA, dirB) => {
  const absDir = path.resolve(path.join(dirA, dirB));
  if (!fs.existsSync(absDir)) {
    await createDirPromise(absDir);
  }
  return absDir;
};

export const getDirByTime = (strISODate) => {
  const dateObj = new Date(strISODate);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const strYear = pad(year, 4);
  const srtMonth = pad(month, 2);
  const srtDay = pad(day, 2);
  return `${strYear}/${srtMonth}/${srtDay}`;
};

export const getAbsoluteFolderAndCreateIfNotExist = async (subDir) => {
  const absDir = path.resolve(path.join(__dirname, '../../', subDir));
  if (!fs.existsSync(absDir)) {
    await createDirPromise(absDir);
  }
  return absDir;
};
export const getDirByTimeAndCreateIfNotExist = async (absoluteParentDir, strISODate) => {
  const dirByTime = getDirByTime(strISODate);
  const absoluteUrl = path.join(absoluteParentDir, dirByTime);
  if (!fs.existsSync(absoluteUrl)) {
    await createDirPromise(absoluteUrl);
  }
  return absoluteUrl;
};

export const readExcelFile = (filePath, objectHeaderMap, defaultValue) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  return sheetNameList.map((y) => {
    const worksheet = workbook.Sheets[y];
    let headers = {};
    const data = [];
    for (const z in worksheet) {
      if (z[0] === '!') continue;
      // parse out the column, row, and value
      let tt = 0;
      for (let i = 0; i < z.length; i += 1) {
        if (!isNaN(z[i])) {
          tt = i;
          break;
        }
      }
      const col = z.substring(0, tt);
      const row = parseInt(z.substring(tt), 10);
      const value = worksheet[z].v;
      // store header names
      if (row === 1 && value) {
        continue;
      }
      headers = Object.assign(headers, objectHeaderMap);
      if (!data[row]) {
        data[row] = {};
      }
      if (headers[col]) {
        data[row][headers[col]] = value;
      }
      data[row] = {
        ...data[row],
        ...defaultValue
      };
    }
    data.shift();
    data.shift();
    return data;
  });
};
