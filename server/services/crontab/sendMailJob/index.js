/* eslint no-console: 0 */
import { CronJob } from 'cron';

export const main = async () => {
  try {
    console.log('main JOB :', Date.now());
  } catch (err) {
    console.log('err :', err);
  }
};

export const sendMailJob = new CronJob({
  cronTime: '00 10 10 * * *',
  onTick: () => {
    main()
      .then(() => {
        console.log('Main done !');
      })
      .catch(err => console.log('err :', err));
  },
  start: false,
  timeZone: 'Asia/Ho_Chi_Minh'
});
