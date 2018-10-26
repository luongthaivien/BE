
'use strict'
const debug = require('debug')('peer-calls:socket')
const _ = require('underscore')
export default function dataStreamVideo(_socket) {
  // SIGNAL
  _socket.on('signal', payload => {
    debug('signal: %s, payload: %o', _socket.id, payload);
    _socket.to(payload.userId).emit('signal', {
      userId: _socket.id,
      signal: payload.signal
    })
  })

  // READY
  _socket.on('ready', roomName => {
    debug('ready: %s, room: %s', _socket.id, roomName)
    if (_socket.room) _socket.leave(_socket.room)
    _socket.room = roomName
    _socket.join(roomName)
    _socket.room = roomName

    let users = getUsers(roomName)
    debug('ready: %s, room: %s, users: %o', _socket.id, roomName, users)
    _socket.to(roomName).emit('users', {
      initiator: _socket.id,
      users
    })
  })

  function getUsers (roomName) {
    return _.map(_socket.adapter.rooms[roomName].sockets, (_, id) => {
      return { id }
    })
  }
}
