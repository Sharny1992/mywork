class Pager{
  constructor(page, count, limit, search){
    this.page = page
    this.count = count
    this.limit = limit
    this.search = search
  }
  next(){
    return this.displayLink(this.page+1)
  }
  previos(){
    return this.displayLink(this.page-1)
  }
  hasNext(){
    return this.page < Math.ceil(this.count/this.limit)
  }
  hasPrevios(){
    return this.page != 1
  }
  pages(){
    let arr = []
    for(let i = 0;i < Math.ceil(this.count/this.limit);i++){
      let href = this.displayLink(this.page+1)
      let text =  i +1
      arr.push({href,text})
    }
    return arr
  }
  hasPagination(){
    return this.count > this.limit
  }
  displayLink(page){
    if(this.search){
      return `/search?q=${this.search}&page=${page}`
    }
    return `/page/${page}`
  }
}
module.exports = { Pager }


/*<nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <% if(page != 1){%> 
      <li class="page-item"><a class="page-link" href="/page/<%= page -1%>">Previous</a></li>
      <%}%>
      <% for(let i = 0; i < Math.ceil(count/limit);i++) {%>   
      <li class="page-item"><a class="page-link" href="/page/<%=i+1%>"><%= i+ 1%></a></li>
      <%}%>
      <% if(page < Math.ceil(count/limit)){%>
      <li class="page-item"><a class="page-link" href="/page/<%= page +1%>">Next</a></li>
      <%}%>
    </ul>
  </nav>*/