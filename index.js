/* eslint no-console: 0 */
// config should be imported before importing any other file
// import 'babel-polyfill'
import SocketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import lodash from 'lodash'

import config from './initial/config'

import app from './initial/express'
import * as CommontEventListeners from './server/services/socket/common.event.listeners'
import * as SocketHander from './server/services/socketio.handler'
import { sendMailJob } from './server/services/crontab/sendMailJob/index'

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
// listen on port config.port
const server = (!module.parent) ?
  app.listen(config.port, () => {
    console.info(`Backend API Server started on port ${config.port} (${config.env})`) // eslint-disable-line no-console
    sendMailJob.start()
  }) : null

export const io = new SocketIO(server, { origins: '*:*' })

io.use(socketioJwt.authorize({
  secret: config.jwt_secret,
  handshake: true,
  // callback: 500
}))
io.on('connection', (socket) => {
  // socket.removeAllListeners()
  // app.set('currentSocket', socket)

  // handle socket servers
  // console.log('>>server')
  require('./server/socket.io/index')(socket) // eslint-disable-line
  // console.log('>>>>>here')
  // const userId = lodash.get(socket.decoded_token, 'user_id', '')
  // SocketHander.socketIOHandler(socket, io, '--')
  // CommontEventListeners.onDing(socket, io)
})
io.on('disconnect', (socket) => {
  const userId = lodash.get(socket.decoded_token, 'user_id', '')
  console.log('Disconnected :', userId)
})
export default app
