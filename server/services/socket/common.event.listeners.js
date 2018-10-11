/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */
import * as socketCommonActions from './common.action';

export const onDisconnect = (socket, io) => {
  socket.on('disconnect', () => {
    console.log('ClientID :', socket.id, ' is Disconnected');
  });
};

export const onDing = (socket) => {
  socket.on('ding', (data) => {
    socketCommonActions.sendToAllExceptSender({
      socket,
      senderId: socket.id,
      chanel: 'dong',
      msg: data
    });
  });
};

