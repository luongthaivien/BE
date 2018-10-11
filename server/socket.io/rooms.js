

export default function dataStreamVideo(_socket) {
  _socket.on('send-data-client', data => {
    console.log(data)
  })
}
