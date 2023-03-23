
const websocketR = (fastify, websocket_servise) => {
  let broad_cast = () => {
    fastify.websocketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        let obj = {type: 'online', count: websocket_servise.count()}
        let json = JSON.stringify(obj)
        client.send(json)
      }
    })
  }
  fastify.get('/statusonline', { websocket: true }, async (connection, request) => {
    websocket_servise.inc()
    broad_cast()
    connection.socket.on('message', message => {
    })
    connection.socket.on('close', message => {
      websocket_servise.dec()
      broad_cast()
    })
  })
}
module.exports = { websocketR }