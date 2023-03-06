const appRoot = require('app-root-path')['path'];
const { c } = require('../utils/c')
const { render } = require('../render')
const path = require('path'),
    registration = path.join(appRoot, "public", 'registration.ejs');
let signupbody = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {
                    type: 'string'
                },
                username: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                },
            },
            required: ['email', 'username', 'password']
        }
    }
}
const signupR = (user_service) => {
    return (fastify, _, done) => {
        fastify.get('/signup', async (request, reply) => {
            let reguser = render(registration, request, {})
            return reply.code(200).type('text/html').send(reguser)
        })
        fastify.post('/signup', signupbody, async (request, reply) => {
            let newuser = {
                email: request.body.email,
                password: request.body.password,
                username: request.body.username
            }
            if (await user_service.find_by_email(newuser.email)) {
                c(`${newuser.email}  already present`)
                return reply.code(400).type('aplication/json').send({ message: 'email already present' })
            }
            await user_service.insert(newuser)
            return reply.code(200).type('text/plain').send('ok8')
        })
        done()
    }
}
module.exports = { signupR }