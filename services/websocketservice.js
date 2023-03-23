class WebSocketService {
  constructor(num) {
    this.num = num
  }
  inc(){
    this.num = this.num +1
  }
  dec(){
    this.num = this.num -1
  }
  count(){
    return this.num
  }
}
module.exports = { WebSocketService }