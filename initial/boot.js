/* eslint no-console: 0 */

import UsersModel from '../server/models/idModel/UsersModel';

const boot = async () => {
  try {
    await UsersModel.sequelizeModel.sync();
  } catch (err) {
    console.log('\n\n\nError : ', JSON.stringify(err), '\n\n\n');
  }
};

boot()
  .then(() => {
    console.log('Booted done !');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n\n\nError on boot() : ', JSON.stringify(err), '\n\n\n');
    process.exit(0);
  });
