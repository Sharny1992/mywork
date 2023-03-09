const { DateTime } = require('luxon')

class CommentService {
  constructor(knex) {
    this.knex = knex
  }
  async find_latest() {
    let comments = await this.knex('comment').orderBy('id','desc').limit(4)
    return comments
  }

  async filter_by_newsid(id) {
    let comments = await this.knex('comment').where({ newsid: id })
   
    for (let i = 0; i < comments.length; i++) {
      const myDateTime = DateTime.fromSeconds(comments[i]['date'] / 1000) 
      const myDateTimeISO = myDateTime.toLocaleString(DateTime.DATETIME_MED);
      comments[i]['human_date'] = myDateTimeISO 
    }
    return comments
  }
  async insert(comments) {
    await this.knex.insert(comments).into('comment')
  }
  async find_by_id(id) {
    let usercomment = await this.knex('comment').where({
      id: id
    }).first()
    return usercomment
  }
  async update(comment, id) {
    await this.knex('comment').where({
      id: id
    }).update(comment)
  }
  async delete(id) {
    await this.knex('comment').where({ id: id }).del()
  }

}
module.exports = { CommentService }