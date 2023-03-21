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
  async find_not_deleted(offset,limit) {
    let userpostfilter = await this.knex.select().table('posts').offset(offset).limit(limit)
    return this.add_short_content(userpostfilter)
  }
  async search_count(q){
    let count = await this.knex('posts').whereLike('titlenews',`%${q}%`).orWhereLike('content',`%${q}%`).count()
    return count[0]['count(*)']
  }
  async search(q,offset,limit) {

    let filtersearch = await this.knex('posts').offset(offset).limit(limit).whereLike('titlenews', `%${q}%`)
      .orWhereLike('content', `%${q}%`)
    return this.add_short_content(filtersearch)
  }
  async post_count(){
    let count = await this.knex('posts').count()
    return count[0]['count(*)']
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
  
  async latest_post(userid) {
    let posts = await this.knex('posts').where({ userid: userid }).limit(3)
    return posts
  }

}
module.exports = { PostService }