const ejs = require('ejs')
const fs = require('fs')
const  path = require('path');


let render = function(filename ,request,obj){
  obj['isLogin'] = request.session?.authenticated || false;
  obj['username'] = request.session?.username;
  let data = fs.readFileSync(filename,{ encoding: "utf-8" })
  let content = ejs.render(data, obj , { views: [path.join(__dirname, 'public')] });
 return content;
}
module.exports = { render }