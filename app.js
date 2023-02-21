const { request } = require('http')
const ejs = require('ejs')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const { c } = require('./utils/c')
const { render } = require('./render')
const { loginR } = require('./routing/login')
const { usersR } = require('./routing/users')
const { signupR } = require('./routing/signup')
const { newsR } = require('./routing/news')
const { commentsR } = require('./routing/comments')
const querystring = require('querystring')
const fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, "public", 'index.ejs'),

  newpost = path.join(__dirname, "public", 'newpost.ejs'),

  singlepost = path.join(__dirname, "public", 'singlepost.ejs'),
  css = path.join(__dirname, "public", 'app.css');
const fastify = require('fastify')({
  loging: true,
  querystringParser: str => querystring.parse(str.toLowerCase())
})
let users = [{ email: 'usa@.usa', username: 'baz', password: 'qwert', id: 1 }]
let posts = []
let comment = []
fastify.get('/app.css', async (request, reply) => {
  let data = fs.readFileSync(css, { encoding: "utf-8" })
  return reply.code(200).type('application/css').send(data)
})
fastify.get('/search', async (request, reply) => {
  let q = request.query.q
  let filter = posts.filter((a) => { return a.titlenews.includes(q) || a.content.includes(q) })
  let content = render(filePath, request, { posts: filter })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/posts/:id', async (request, reply) => {
  let post = posts[request.params.id - 1]
  if (!post) {
    return reply.code(404).type('text/html').send('not post')
  }
  let user = users.find((u) => { return u.id == post.userid })
  let filter = comment.filter((a) => { return a.newsid == request.params.id })
  let content = render(singlepost, request, { post, user, comments: filter })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/', async (request, reply) => {
  return reply.code(200).type('text/html').send(render(filePath, request, { posts: posts, isLogin: request.session.authenticated }))
})
fastify.get('/newpost', async (request, reply) => {
  if (!request.session?.authenticated) {
    return reply.redirect('/login')
  }
  let content = render(newpost, request, {})
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/features/actions', async (request, reply) => {
  return reply.code(200).type('text/plain').send('ok2')
})
fastify.get('/:user', async (request, reply) => {
  return reply.code(200).type('text/plain').send(request.params.user)
})
fastify.get('/:user/:repo', async (request, reply) => {
  return reply.code(200).type('text/plain').send(`${request.params.user}+${request.params.repo}`)
})

let news = newsR(posts)
let comments = commentsR(posts, comment)
let signup = signupR(users)
let login = loginR(users)
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: { secure: false },
  expires: 1800000
})
fastify.register(news)
fastify.register(comments)
fastify.register(signup)
fastify.register(login)
fastify.register(usersR(users))
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    c(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
start()