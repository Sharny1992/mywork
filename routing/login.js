const appRoot = require('app-root-path')['path'];
const { c } = require('../utils/c')
const path = require('path'),
    login = path.join(appRoot, "public", 'login.ejs');

let loginbody = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                },

            },
            required: ['email', 'password']
        }

    }
}

//var signupF = (arr) => { return (a) => { arr.push(a); console.log(a + 1) } }



const loginR = (user_service, render) => {
    return (fastify, _, done) => {
        fastify.get('/login', async (request, reply) => {
            let enter = await render.render(login, request, {})
            return reply.code(200).type('text/html').send(enter)
        })
        fastify.get('/loginout', (request, reply) => {
            if (request.session.authenticated) {
                request.destroySession((err) => {
                    if (err) {
                        reply.status(500)
                        reply.send('Internal Server Error')
                    } else {
                        reply.redirect('/')
                    }
                })
            } else {
                reply.redirect('/')
            }
        });
        fastify.post('/login', loginbody, async (request, reply) => {
            let newuser = {
                email: request.body.email,
                password: request.body.password
            }
            let user = await user_service.find_by_email_pass(newuser.email,newuser.password)
            
            if (!user) {
                c(`${newuser.email} not found`)
                return reply.code(400).type('application/json').send({ message: 'incorrect email' })
            }
            request.session.is_admin = user.is_admin 
            request.session.userid = user.id
            request.session.useremail = user.email
            request.session.username = user.username
            request.session.authenticated = true
            return reply.code(200).type('text/plain').send('good')
        })

        done();
    }
};

module.exports = { loginR }