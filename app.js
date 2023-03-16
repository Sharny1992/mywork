const { request } = require('http')
const ejs = require('ejs')
const knex = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "./mydb.sqlite"
  }
});

const fileUpload = require('fastify-file-upload')
const {CurrencyService} = require('./services/currencyservice')
const {CommentService} = require('./services/comentservice')
const {PostService} = require('./services/postservice')
const {UserService} =require('./services/userservice')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const { c } = require('./utils/c')
const { Render } = require('./render')
const { loginR } = require('./routing/login')
const { usersR } = require('./routing/users')
const { signupR } = require('./routing/signup')
const { newsR } = require('./routing/news')
const { commentsR } = require('./routing/comments')
const querystring = require('querystring')
const fs = require('fs'),
  path = require('path'),
  edit = path.join(__dirname, "public", 'edit.ejs'),
  index = path.join(__dirname, "public", 'index.ejs'),
  newpost = path.join(__dirname, "public", 'newpost.ejs'),
  singlepost = path.join(__dirname, "public", 'singlepost.ejs'),
  css = path.join(__dirname, "public", 'app.css'),
  main = path.join(__dirname, "public", 'main.js');
const fastify = require('fastify')({
  loging: true,
  querystringParser: str => querystring.parse(str.toLowerCase())
})
const Limit = 10
let currency_service = new CurrencyService()
let user_service = new UserService(knex)
let post_service = new PostService(knex)
let comments_service = new CommentService(knex)
let render = new Render(comments_service, currency_service)
fastify.get('/app.css', async (request, reply) => {
  let data = fs.readFileSync(css, { encoding: "utf-8" })
  return reply.code(200).type('application/css').send(data)
})
fastify.get('/main.js', async (request, reply) => {
  let data = fs.readFileSync(main, { encoding: "utf-8" })
  return reply.code(200).type('application/javascript').send(data)
})
fastify.get('/public/avatar/:picture', async (request, reply) => {
  let picture = request.params.picture
  let data = fs.readFileSync(path.join(__dirname,'public','avatar',picture))
  return reply.code(200).send(data)
})

fastify.get('/search', async (request, reply) => {
  let q = request.query.q
  let rate = await currency_service.get_usd_rates()
  let comments = await comments_service.find_latest()
  let filter = await  post_service.search(q)//{ return a.titlenews.includes(q) || a.content.includes(q) })
  let content = await render.render(index, request, { posts: filter, comments,rate })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/posts/:id', async (request, reply) => {
  let post = await post_service.find_by_id(request.params.id) 
  if (!post) {
    return reply.code(404).type('text/html').send('not post')
  }
  let canEdit = post.userid == request.session.userid || request.session?.is_admin
  let user = await  user_service.find_by_id(post.userid)   
  let filter = await comments_service.filter_by_newsid(request.params.id)
  let content = await render.render(singlepost, request, { post, user, canEdit, comments:filter })
  return reply.code(200).type('text/html').send(content)
})

fastify.get('/', async (request, reply) => {
  let posts = await  post_service.find_not_deleted(0,Limit)
  let count = await post_service. post_count()
  let content = await render.render(index, request, 
    { posts: posts,page:1, count,limit:Limit, isLogin: request.session.authenticated
    })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/page/:page',async (request,reply)=>{
  let page = +request.params.page 
  let offset = ((page -1) * Limit)   
  let posts = await  post_service.find_not_deleted(offset,Limit)//1 limit 0-11-21 10*0/1 
  let count = await post_service. post_count()
  let content = await render.render(index, request, 
    { posts: posts,page, count,limit:Limit, isLogin: request.session.authenticated
   })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/newpost', async (request, reply) => {
  if (!request.session?.authenticated) {
    return reply.redirect('/login')
  }
  let content = await render.render(newpost, request, {})
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/posts/:id/edit', async (request, reply) => {
  if (!request.session?.authenticated) {
    return reply.redirect('/login')
  }
  let post = await post_service.find_by_id(request.params.id) 
  if (!post) {
    return reply.code(404).type('text/html').send('not post')
  }
  let canEdit = post.userid == request.session.userid || request.session?.is_admin
  if(!canEdit){
    return reply.code(403).type('text/html').send('can not edit post')
  }
  let content = await render.render(edit, request, {post})
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
let signup = signupR(user_service,render)
let login = loginR(user_service,render)
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: { secure: false },
  expires: 1800000
})
fastify.register(fileUpload)
fastify.register(news)
fastify.register(comments)
fastify.register(signup)
fastify.register(login)
fastify.register(usersR(user_service, post_service, render))
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