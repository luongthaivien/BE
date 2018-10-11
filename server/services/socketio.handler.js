/* eslint no-console: 0 */

import * as CommontEventListeners from './socket/common.event.listeners';
import * as CommontAction from './socket/common.action';

export const socketIOHandler = (departmentIO, io, room) => {
  departmentIO.on('connection', (socket) => {
    CommontAction.trackingClient({ socket, departmentIO, io, room });
    CommontEventListeners.onDisconnect(socket, departmentIO);
    CommontEventListeners.onDing(socket, departmentIO);
    CommontEventListeners.onCommentAttachment(socket, departmentIO);
  });
};

