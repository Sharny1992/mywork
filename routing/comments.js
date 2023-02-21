const { c } = require('../utils/c')
let commentsbody = {
  schema: {
    params: {
      id: {
        type: 'integer',
      }
    },
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string'
        },
        comment: {
          type: 'string'
        },
        newsid: {
          type: 'integer'
        },
      },
      required: [ 'comment', 'newsid']
    }
  }
}
let arr = [{newsid:1,email:2},{newsid:5,email:6},{newsid:8,email:9}]

const commentsR = (downloadnews, text) => {
  return (fastify, _, done) => {
    fastify.get('/comments', async (request, reply) => {
      return reply.code(200).type('text/plain').send('ok3')
    })
    fastify.get("/news/:newsid/comments",async(request,reply)=>{
      let id = request.params.newsid;
      let xs = text.filter((a)=>{return a.newsid == id})
      return reply.code(200).type('application/json').send(xs)
    })
    fastify.post('/comments',commentsbody, async (request, reply) => {
      let email = request.body.email
      if(request.session?.authenticated){
        email = request.session.useremail
      }
      if(email == null || email == ''){
        return reply.code(400).type('application/json').send({message:'email is required'})
      }
      let savecommnet = {
        email: email,
        comment: request.body.comment,
        newsid: request.body.newsid,
        id: text.length + 1,
        date: new Date()
      }
      let post = downloadnews[request.body.newsid - 1]
      if (!post) {
        return reply.code(404).send()
      }
      text.push(savecommnet)
      return reply.code(200).type('application/json').send(savecommnet)
    })
    fastify.get('/comments/:id', async (request, reply) => {
      let comment = text[request.params.id - 1]
      if (!comment) {
        return reply.code(404).send()
      }
      return reply.code(200).type('application/json').send(comment)
    })
    fastify.put('/comments/:id', async (request, reply) => {
      let savecommnet = {
        email: request.body.email,
        comment: request.body.comment,
        newsid: request.body.newsid,
        id: request.params.id,
        date: new Date()
      }
      let comment = text[request.params.id - 1]
      if (!comment) {
        return reply.code(404).send()
      }
      if (comment.newsid != savecommnet.newsid) {
        return reply.code(400).send()
      }
      text[request.params.id - 1] = savecommnet
      return reply.code(200).type('application/json').send(savecommnet)

    })
    fastify.delete('/comments/:id', async (request, reply) => {
      let com = text[request.params.id - 1]
      if (!com) {
        return reply.code(404).send()
      }
      text[request.params.id - 1] = null
      return reply.code(200).send()
    })
    done()
  }
}
module.exports = { commentsR }