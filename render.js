const ejs = require('ejs')
const fs = require('fs')
const  path = require('path');

class Render{
  constructor(comments_service, currency_service){
    this.comments_service = comments_service
    this.currency_service = currency_service
  }
  async render(filename ,request,obj){
    obj['isLogin'] = request.session?.authenticated || false;
    obj['username'] = request.session?.username;
    obj['rate'] = await this.currency_service.get_usd_rates()
    obj['latest_comments'] = await this.comments_service.find_latest()
    let data = fs.readFileSync(filename,{ encoding: "utf-8" })
    let content = ejs.render(data, obj , { views: [path.join(__dirname, 'public')] });
   return content;
  }
}

module.exports = { Render }