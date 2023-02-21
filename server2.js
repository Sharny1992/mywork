                      //Create server

const { request } = require('http')
const querystring = require('querystring')
const fastify = require('fastify')({
    loging:true,
  querystringParser: str => querystring.parse(str.toLowerCase())
})
let c = function(f){
    console.log(f)
}

fastify.get('/test-page', async (request, reply) => {
  return reply.code(200).type('text/plain').send('ok')
})

fastify.get('/test', async (request,reply)=>{
    c(request.query['foo'])
    return reply.code(200).type('text/plain').send('ok2')
})
fastify.get('/profile/:id', async(request,reply)=>{
    c(request.params)
    return reply.code(200).type('text/plain').send('ok3')

})

let schema = {
    schema: {
      params: {
        id: {
          type: 'integer',
        }
      }
    }}
fastify.get('/profile1/:id', schema,  async(request,reply)=>{
        c(request.params['id'])
        return reply.code(200).type('text/plain').send('ok4')
    })
fastify.post('/profile',async(request,reply)=>{
    c(request.body)
    return reply.code(200).type('text/plain').send('ok5')
}) 
let schemabody = {
    schema: {
      body: {
        type:'object',
        properties:{
            age:{
                type:'integer'
            },
            name: {
                type: 'string',
              }
        },
        required:['name']
      }
    }}   
    fastify.post('/profile1',schemabody,async(request,reply)=>{
        c(request.body)
        return reply.code(200).type('text/plain').send('ok6')
    }) 


















const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    }
    start()