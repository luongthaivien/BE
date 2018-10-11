import moment from 'moment';

moment.locale('vi');

export const echoDateTime = (date) => {
  const a = moment(date).format('DD/MM/YYYY HH:mm');
  return a === 'Invalid date' ? '' : a;
};
export const fromNow = (date) => {
  const tmpDate = moment(date).add(1, 'hours');
  const a = tmpDate.startOf('hours').fromNow();
  return a === 'Invalid date' ? '' : a;
};
export const calPercentBetween = (from, to, now = null) => {
  const start = new Date(from);
  const end = new Date(to);
  const today = now || new Date();
  return Math.round(((today - start) / (end - start)) * 100);
};
export const isOutOfDate = (now, replyTimeExpect) => moment(now).isAfter(replyTimeExpect);
// const isTimeWarning =
//   (date, duration) => moment.duration((new Date()).diff(new Date(date))).asMinutes();

export const isTimeWarning = (now, replyTimeExpect, duration) => {
  const startTime = moment(now);
  const endTime = moment(new Date(replyTimeExpect));
  return moment.duration(startTime.diff(endTime)).asMinutes() <= duration;
};

export const getDuration = (from, to) => {
  const startTime = new Date(from);
  const endTime = new Date(to);
  const tmpDiff = endTime.getTime() - startTime.getTime();
  return (tmpDiff / 60000);
};

export const checkOutOfDate = (from, to, duration) => {
  const tmpDuration = getDuration(from, to);
  if (tmpDuration < 0) {
    return 1;
  } else if ((tmpDuration - duration) >= 0) {
    return 3;
  }
  return 2;
};


export default {
  echoDateTime,
  calPercentBetween,
  fromNow,
  isOutOfDate,
  isTimeWarning,
  getDuration,
  checkOutOfDate
};
