class PostService {
  constructor(knex) {
    this.knex = knex
  }
  async find_by_id(id) {
    let userpost = await this.knex('posts').where({
      id: id
    }).first()
    return userpost
  }
  async update(post, id) {
    // this.posts[id - 1] = post
    await this.knex('posts').where({
      id: id
    }).update(post)
  }
  async find_not_deleted() {
    let userpostfilter = await this.knex.select().table('posts')
    return this.add_short_content(userpostfilter)
  }

  async insert(post) {
    let arrpost = await this.knex.insert(post).into('posts')
    return arrpost[0]
  }
  async count_by_user(id) {
    let count = await this.knex('posts').where({ userid: id }).count('*')
    return count[0]['count(*)']
  }
  async delete(id) {
    await this.knex('posts').where({ id: id }).del()
  }
  add_short_content(posts) {
    for (let i = 0; i < posts.length; i++) {
      posts[i]['short_content'] = posts[i].content.slice(0, 100)
    }
    return posts;
  }
  async search(q) {
    let filtersearch = await this.knex('posts').whereLike('titlenews', `%${q}%`)
      .orWhereLike('content', `%${q}%`)
    return this.add_short_content(filtersearch)

  }
  async latest_post(userid) {
    let posts = await this.knex('posts').where({ userid: userid }).limit(3)
    return posts
  }

}
module.exports = { PostService }