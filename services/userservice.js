
class UserService {
  constructor( knex) {
    this.knex = knex
  }
  async find_by_id(id) {
    let user = await this.knex('users').where({
      id: id
    }).first()
    return user
  }
  async update(user,id){
     await this.knex('users').where({
    id: id
   }).update(user)
  }
  async find_by_email_pass(email, password) {
    let user = await this.knex('users').where({
      email: email,
      password: password
    }).first()
    return user;
  }
  async insert(user) {
    await this.knex.insert(user).into('users')
  }
  async find_by_email(email) {
    let user = await this.knex('users').where({
      email: email
    }).first()
    return user
  }
}
module.exports = { UserService }