const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host+'/statusonline')
ws.onmessage = msg =>{
  let span  = document.querySelector('#online-count')
  let json = JSON.parse(msg.data)
  if(json.type == 'online'){
    span.innerHTML = json.count
  }
  
} 


const alert = (alertPlaceholder, message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}