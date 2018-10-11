/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */
// ============================== COMMON ACTIONS ===================================================
import Promise from 'bluebird';
import { distinctArrayClientFromUserList } from '../../helpers/base.helper';

// sending to the all client
export const getAllClients = ({ io }) => (new Promise((resolve, reject) => {
  io.clients((error, clients) => {
    if (error) {
      reject(error);
    }
    const ls = clients.map((socketId) => {
      const c = io.sockets.connected[socketId];
      return {
        clientId: socketId,
        userId: c.decoded_token.user_id
      };
    });
    resolve(ls);
  });
}));

// sending to individual socketid (private message)
export const sendIndividualClientMulti = ({ socket, clients, channel, msg }) => {
  clients.map(c => socket.to(c.clientId).emit(channel, msg));
};
// sending to individual socketid (private message)
export const sendIndividualClientInRoomMulti = ({ io, room, clients, channel, msg }) => {
  clients.map((client) => {
    const socket = io.sockets.connected[client.clientId]; // assuming you have  id of the socket
    return socket.emit(channel, msg);
  });
};
// sending to individual socketid (private message)
export const sendIndividualClientFromUserList = async({ io, room, userList, channel, msg }) => {
  const clients = await getAllClients({ io });
  const clientsReceive = distinctArrayClientFromUserList(clients, userList);
  sendIndividualClientInRoomMulti({
    io,
    room,
    clients: clientsReceive,
    channel,
    msg
  });
};// sending to individual socketid (private message)
export const sendIndividualClientFromUser = async({ io, room, user, channel, msg }) => {
  const clients = await getAllClients({ io });
  const clientsReceive = distinctArrayClientFromUserList(clients, [user]);
  sendIndividualClientInRoomMulti({
    io,
    room,
    clients: clientsReceive,
    channel,
    msg
  });
};

// sending to the all client
export const sendToAll = ({ socket, channel, msg }) => {
  socket.emit(channel, msg);
};

// sending to all clients except sender
export const sendToAllExceptSender = ({ socket, senderId, channel, msg }) => {
  // console.log('socket :', socket);
  socket.broadcast.to(senderId).emit(channel, msg);
};

// sending to all clients in 'room' room except sender
export const sendToAllInRoomExceptSender = ({ socket, room, channel, msg }) => {
  socket.to(room).emit(channel, msg);
};

// sending to all clients in 'room1' and/or in 'room2' room, except sender
export const sendToAllInBothRoomExceptSender = ({ socket, room1, room2, channel, msg }) => {
  socket.to(room1).to(room2).emit(channel, msg);
};

// sending to all clients in room, including sender
export const sendToRoomIncludingSender = ({ io, room, channel, msg }) => {
  io.in(room).emit(channel, msg);
};

// sending to all clients in namespace 'myNamespace', including sender
export const sendToNamespaceIncludingSender = ({ io, myNamespace, channel, msg }) => {
  io.of(myNamespace).emit(channel, msg);
};

// sending to individual socketid (private message)
export const sendIndividualClient = ({ socket, clientId, channel, msg }) => {
  socket.to(clientId).emit(channel, msg);
};

// sending to individual socketid (private message)
export const sendIndividualClientInRoom = ({ io, room, clientId, channel, msg }) => {
  io.in(room).to(clientId).emit(channel, msg);
};


export const trackingClient = ({ socket, departmentIO, io, room }) => {
  // const userId = lodash.get(socket.decoded_token, 'user_id', '');
  // console.log('ClientID :', socket.id, ' is connected');
  // console.log(' socket:', socket);
  // console.log(' io:', io.of('departmentzz').clients());
};
