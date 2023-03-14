const appRoot = require('app-root-path')['path'];
const { request } = require('http');
const { render } = require('../render')
const { c } = require('../utils/c')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const mime = require('mime');
const path = require('path'),
  profile = path.join(appRoot, "public", 'profile.ejs');
const usersR = (user_service,post_service) => {
  return (fastify, _, done) => {
    
    fastify.post('/profile', async (request, reply) => {
      let id = request.session.userid
      let user = await user_service.find_by_id(id)
      user.biography = request.body.biography
      await user_service.update(user,id)
      return reply.code(200).type('application/json').send({})
    })
    fastify.post('/upload', async (request, reply) => {
      const files = request.raw.files
      if (!request.session?.authenticated) {
        return reply.redirect('/login')
      }
      if(files != null && files.length == 0){
        return reply.code(400).type('application/json').send({'error':'Empty Files'})
      }
      let id = request.session.userid
      let user = await user_service.find_by_id(id)
      if(user.avatar && fs.existsSync(`./public/avatar/${user.avatar}`)){
          fs.unlink(`./public/avatar/${user.avatar}`, (err)=>{
            if(err) throw err;
          }) 
        
      }
      let file = files.photo
      let ext = mime.getExtension(file.mimetype);
      let extensions = ['jpg','jpeg','png','gif']
      if(!extensions.includes(ext) ){
        return reply.code(400).type('application/json').send({'error':'Invalid Format'})
      }
      let filename = uuidv4()
      filename = `avatar-${filename}.${ext}`
      let root = `./public/avatar/${filename}`
      user.avatar = filename
      await user_service.update(user,id)
      fs.writeFile(root, file.data,  function (err) {
        if (err) throw err;               console.log('Results Received');
      }); 
      reply.send({})
    })
    let load_user_room = async function(request, isme,user){
      if(user.avatar == null){
        user.avatar = 'blank-avatar.jpg'
      }

      let count = await post_service.count_by_user(user.id)
      let posts = await post_service.latest_post(user.id)
      let myroom = render(profile, request, { user,count, posts, isme })
      return myroom
    }
    fastify.get('/profile', async (request, reply) => {
      if (!request.session?.authenticated) {
        return reply.redirect('/login')
      }
      let id = request.session.userid
      let user =await  user_service.find_by_id(id)
      let myroom =  await load_user_room(request,true,user)  
      return reply.code(200).type('text/html').send(myroom)
    })
    fastify.get('/profile/:userid', async (request, reply) => {
      let id = request.params.userid
      let user = await user_service.find_by_id(id)
      if (!user) {
        return reply.code(404).type('text/html').send('not profile')
      }
      let isme = id == request.session?.userid
      let usersroom = await load_user_room(request,isme,user) //render(profile, request, { user,count,posts, isme })
      return reply.code(200).type('text/html').send(usersroom)
    })
    done();
  }
};

module.exports = { usersR }