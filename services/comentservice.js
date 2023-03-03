class CommentService {
  constructor(knex) {
    this.knex = knex
  }
 async filter_by_newsid(id){
    let news = await this.knex('comment').where({newsid:id})
    return news
  }
 async insert(comments){
    await this.knex.insert(comments).into('comment')
  }
  async find_by_id(id) {
    let usercomment = await this.knex('comment').where({
      id: id
    }).first()
    return usercomment
  }
  async update(comment,id){
    await this.knex('comment').where({
      id: id
    }).update(commnet)
  }
  async delete(id){
    await this.knex('comment').where({ id: id }).del()
  }

}
module.exports = { CommentService }