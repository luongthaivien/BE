/* eslint no-console: 0 */

import { main } from './index';

main()
  .then(() => {
    console.log('Main done !');
    process.exit();
  })
  .catch(err => console.log('err :', err));
