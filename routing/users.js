const appRoot = require('app-root-path')['path'];
const { request } = require('http');
const { render } = require('../render')
const { c } = require('../utils/c')
const path = require('path'),
  profile = path.join(appRoot, "public", 'profile.ejs');
const usersR = (user_service,post_service) => {
  return (fastify, _, done) => {
    fastify.get('/profile', async (request, reply) => {

      if (!request.session?.authenticated) {
        return reply.redirect('/login')
      }
      let id = request.session.userid
      let user =await  user_service.find_by_id(id)
      let count = await post_service.count_by_user(id)
      let posts = await post_service.latest_post(id)
      let myroom = render(profile, request, { user,count, posts, isme: true })
      console.log(JSON.stringify(count))
      return reply.code(200).type('text/html').send(myroom)
    })
    fastify.post('/profile', async (request, reply) => {
      let id = request.session.userid
      let user = await user_service.find_by_id(id)
      user.biography = request.body.biography
      await user_service.update(user,id)
      return reply.code(200).type('application/json').send({})
    })

    fastify.get('/profile/:userid', async (request, reply) => {
      let id = request.params.userid
      let user = await user_service.find_by_id(id)
      
      if (!user) {
        return reply.code(404).type('text/html').send('not profile')
      }
      let isme = id == request.session?.userid
      let count = await post_service.count_by_user(id)
      let posts = await post_service.latest_post(id)
      let usersroom = render(profile, request, { user,count,posts, isme })
      return reply.code(200).type('text/html').send(usersroom)
    })
    done();
  }
};

module.exports = { usersR }