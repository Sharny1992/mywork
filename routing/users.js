const appRoot = require('app-root-path')['path'];
const { request } = require('http');
const { render } = require('../render')
const { c } = require('../utils/c')
const path = require('path'),
  profile = path.join(appRoot, "public", 'profile.ejs');
const usersR = (users) => {
  return (fastify, _, done) => {
    fastify.get('/profile', async (request, reply) => {

      if (!request.session?.authenticated) {
        return reply.redirect('/login')
      }
      let id = request.session.userid
      let user = users.find((i) => { return i.id == id })
      let myroom = render(profile, request, { user, isme: true })
      return reply.code(200).type('text/html').send(myroom)
    })
    fastify.post('/profile', async (request, reply) => {
      let id = request.session.userid
      let user = users.find((i) => { return i.id == id })
      user.information = request.body.information
      return reply.code(200).type('application/json').send({})

    })
    fastify.get('/profile/:userid', async (request, reply) => {
      let id = request.params.userid
      let user = users.find((i) => { return i.id == id })
      if (!user) {
        return reply.code(404).type('text/html').send('not profile')
      }
      let isme = id == request.session?.userid

      let usersroom = render(profile, request, { user, isme })
      return reply.code(200).type('text/html').send(usersroom)
    })
    done();
  }
};

module.exports = { usersR }