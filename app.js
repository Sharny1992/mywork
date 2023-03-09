const { request } = require('http')
const ejs = require('ejs')
const knex = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "./mydb.sqlite"
  }
});
const {CurrencyService} = require('./services/currencyservice')
const {CommentService} = require('./services/comentservice')
const {PostService} = require('./services/postservice')
const {UserService} =require('./services/userservice')
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
  index = path.join(__dirname, "public", 'index.ejs'),
  newpost = path.join(__dirname, "public", 'newpost.ejs'),
  singlepost = path.join(__dirname, "public", 'singlepost.ejs'),
  css = path.join(__dirname, "public", 'app.css'),
  main = path.join(__dirname, "public", 'main.js');
const fastify = require('fastify')({
  loging: true,
  querystringParser: str => querystring.parse(str.toLowerCase())
})
let currency_service = new CurrencyService()
let user_service = new UserService(knex)
let post_service = new PostService(knex)
let comments_service = new CommentService(knex)
fastify.get('/app.css', async (request, reply) => {
  let data = fs.readFileSync(css, { encoding: "utf-8" })
  return reply.code(200).type('application/css').send(data)
})
fastify.get('/main.js', async (request, reply) => {
  let data = fs.readFileSync(main, { encoding: "utf-8" })
  return reply.code(200).type('application/javascript').send(data)
})

fastify.get('/search', async (request, reply) => {
  let q = request.query.q
  let rate = await currency_service.get_usd_rates()
  let comments = await comments_service.find_latest()
  let filter = await  post_service.search(q)//{ return a.titlenews.includes(q) || a.content.includes(q) })
  let content = render(index, request, { posts: filter, comments,rate })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/posts/:id', async (request, reply) => {
  let post = await post_service.find_by_id(request.params.id) //[request.params.id - 1]
  if (!post) {
    return reply.code(404).type('text/html').send('not post')
  }
  let user = await  user_service.find_by_id(post.userid)   
  let filter = await comments_service.filter_by_newsid(request.params.id)
  let content = render(singlepost, request, { post, user, comments: filter })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/', async (request, reply) => {
  let rate = await currency_service.get_usd_rates()
  let comments = await comments_service.find_latest()
  let posts = await  post_service.find_not_deleted()
  return reply.code(200).type('text/html').send(render(index, request, 
    { posts: posts, isLogin: request.session.authenticated,
    comments,rate}))
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

let news = newsR(post_service)
let comments = commentsR(post_service, comments_service)
let signup = signupR(user_service)
let login = loginR(user_service)
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
fastify.register(usersR(user_service, post_service))
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