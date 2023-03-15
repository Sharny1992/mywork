const { c } = require('../utils/c')
let newsbody = {
  schema: {
    params: {
      id: {
        type: 'integer',
      }
    },
    body: {
      type: 'object',
      properties: {
        titlenews: {
          type: 'string'
        },
        content: {
          type: 'string'
        },
      },
      required: ['titlenews', 'content']
    }
  }
}


const newsR = (post_service) => {
  return (fastify, _, done) => {
    fastify.post('/news', newsbody, async (request, reply) => {
      if (!request.session?.authenticated) {
        return reply.redirect('/login')
      }
      let savenews = {
        userid: request.session.userid,
        titlenews: request.body.titlenews,
        content: request.body.content
      }
      let id = await post_service.insert(savenews)//downloadnews.push(savenews)
      savenews.id = id
      return reply.code(200).type('application/json').send(savenews)
    })
    fastify.get('/news', async (request, reply) => {
      let filter = await post_service.find_not_deleted(0,10)  // downloadnews.filter((a) => { return a != null })
      return reply.code(200).type('application/json').send(filter)
    })
    fastify.put('/news/:id', newsbody, async (request, reply) => {
      let savenews = {
        id: request.params.id,
        titlenews: request.body.titlenews,
        content: request.body.content
      }
      if (! await post_service.find_by_id(request.params.id)) {
        return reply.code(404).send()
      }
      await post_service.update(savenews, request.params.id) //downloadnews[request.params.id - 1] = savenews
      return reply.code(200).type('application/json').send(savenews)

    })
    fastify.get('/news/:id', async (request, reply) => {
      let post = await post_service.find_by_id(request.params.id)            // downloadnews[request.params.id - 1]
      if (!post) {
        return reply.code(404).send()
      }
      return reply.code(200).type('application/json').send(post)
    })
    fastify.delete('/news/:id', async (request, reply) => {
      let post = await post_service.find_by_id(request.params.id)//downloadnews[request.params.id - 1]
      if (!post) {
        return reply.code(404).send()
      }
      await post_service.delete(request.params.id) //downloadnews[request.params.id - 1] = null
      return reply.code(200).send()
    })
    done()
  }
}


module.exports = { newsR }