const axios = require('axios');
require('axios-debug-log/enable')

let c = function(f){
    console.log(f)
}

test('/',async()=>{
    axios.get('http://localhost:3000/')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('ok1');
        
    })
})
test('/features/actions',async()=>{
    axios.get('http://localhost:3000/features/actions')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('ok2');
        
    })
})
test('/signup',async()=>{
    axios.get('http://localhost:3000/signup')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('ok3');
        
    })
})
test('/login',async()=>{
    axios.get('http://localhost:3000/login')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('ok4');
        
    })
})
test('/:user',async()=>{
    axios.get('http://localhost:3000/abc')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('abc');
        
    })
})
test('/:user/:repo',async()=>{
    axios.get('http://localhost:3000/abc/test')
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('abc+test');
        
    })
})
test('/signup',async()=>{
    axios.post('http://localhost:3000/signup',{
        email:'string',
        username:'hola',
        password:'buratino123'
    })
    .then((response)=>{
        expect(response.status).toBe(200);
        expect(response.data).toBe('ok8')
    })
})

test('/login without name',async()=>{
    axios.post('http://localhost:3000/login',{
        password:'buratino123'
    })
    .then((response)=>{
        expect(response.status).toBe(400);
        
    })
    .catch(function (error) {
         expect(error.response.status).toBe(400);
      })
})

test('/ signup without name',async()=>{
    axios.post('http://localhost:3000/signup',{
        email:'hola@92',
        password:'buratino123'
    })
    .then((response)=>{
        expect(response.status).toBe(400);
        
    })
    .catch(function (error) {
         expect(error.response.status).toBe(400);
      })
})
// proverka emailov
test('/signup and login',async()=>{
    let response = await axios.post('http://localhost:3000/signup',{
        email:'string@hmail.com',
        username:'hola',
        password:'buratino123'
    })
    c(response.data)
    expect(response.status).toBe(200);
    expect(response.data).toBe('ok8')
    try{
       response = await axios.post('http://localhost:3000/signup',{
         email:'string@hmail.com',
         username:'hola',
         password:'buratino123'
        })
        c(response.data)
       expect(true).toBe(false)
       c(2.5)
    }
    catch (error) {
        c(error)
        expect(error.response.status).toBe(400);
        expect(error.response.data).toBe('error')
     }
    response = await axios.post('http://localhost:3000/login',{
        email:'string@hmail.com',
        password:'buratino123'
    })
    c(1)
    expect(response.data).toBe('good')
    expect(response.status).toBe(200)
    c(1.5)
    try{
        response = await axios.post('http://localhost:3000/login',{
          email:'string@hma.com',
          password:'buratino123'
        })
        c(2)
        expect(true).toBe(false)
    }
    catch (error) {
        c(error.response.data)
         expect(error.response.status).toBe(400);
         expect(error.response.data).toBe('error')
      }
}) 

test('/news', async ()=>{
    let response = await axios.post('http://localhost:3000/news',{
        titlenews:'sport',
        content: 'argentina win'
    })
    let id = response.data.id;
    expect(response.status).toBe(200);
    expect(response.data.content).toBe('argentina win')
    response = await axios.get('http://localhost:3000/news')
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(1)
    expect(response.data).toHaveLength(1)
    response = await axios.put(`http://localhost:3000/news/${id}`,{
        titlenews:'sportFootbol',
        content: 'argentina porvala lyagushek'
    })
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1)
    expect(response.data.titlenews).toBe('sportFootbol')
    expect(response.data.content).toBe('argentina porvala lyagushek')
    try{
      response = await axios.put('http://localhost:3000/news/10',{
        titlenews:'sportFootbol',
        content: 'argentina porvala lyagushek'
      })
      expect(true).toBe(false)
    }
    catch (error) {
         expect(error.response.status).toBe(404);
    }
    response = await axios.get(`http://localhost:3000/news/${id}`)
    expect(response.status).toBe(200) 
    expect(response.data.titlenews).toBe('sportFootbol')  
    expect(response.data.content).toBe('argentina porvala lyagushek')  
    try{
        response = await axios.get('http://localhost:3000/news/11')
        expect(true).toBe(false)
    }
    catch(error){
        expect(error.response.status).toBe(404);
    }
    response = await axios.delete(`http://localhost:3000/news/${id}`)
    expect(response.status).toBe(200) 
    
    try{
        response = await axios.delete('http://localhost:3000/news/11')
        expect(true).toBe(false)
    }
    catch(error){
        expect(error.response.status).toBe(404);
    }
    response = await axios.get('http://localhost:3000/news')
    expect(response.status).toBe(200)
    expect(response.data.length).toBe(0)
})
test('/check comment', async ()=>{
    let response = await axios.post('http://localhost:3000/news',{
        titlenews:'sport',
        content: 'argentina win'
    })
    let newsid = response.data.id
    response = await axios.get(`http://localhost:3000/news/${newsid}/comments`)
    expect(response.data.length).toBe(0)

    response = await axios.post('http://localhost:3000/comments',{
        email:'soka@ru',
        newsid: newsid,
        comment: "messi was good"
    })
    expect(response.status).toBe(200);
    expect(response.data.comment).toBe("messi was good")
    let id = response.data.id
    response = await axios.get(`http://localhost:3000/news/${newsid}/comments`)
    expect(response.data.length).toBe(1)
    try{
        response = await axios.post(`http://localhost:3000/comments`,{
            email:'soka@ru',
            newsid: 100,
            comment: "messi was good"
        })
        expect(true).toBe(false)
      }
    catch (error) {
           expect(error.response.status).toBe(404);
      }
    response = await axios.get(`http://localhost:3000/comments/${id}`,)
    expect(response.data.email).toBe('soka@ru')
    expect(response.status).toBe(200);
    response = await axios.put(`http://localhost:3000/comments/${id}`,{
        email:'soka@ru',
        newsid: newsid,
        comment: "messi was good!!!!!"
    })
    expect(response.status).toBe(200);
    expect(response.data.comment).toBe("messi was good!!!!!")
    try{
        response = await axios.put(`http://localhost:3000/comments/100`,{
            email:'soka@ru',
            newsid: newsid,
            comment: "messi was good!!!!!"
        })
        expect(true).toBe(false) 
    }
    catch (error) {
        expect(error.response.status).toBe(404);
        
   }
    try{
    response = await axios.put(`http://localhost:3000/comments/${id}`,{
        email:'soka@ru',
        newsid: 56,
        comment: "messi was good!!!!!"
    })
       expect(true).toBe(false) 
    }
    catch (error) {
       expect(error.response.status).toBe(400);
    
    }
    response = await axios.delete(`http://localhost:3000/comments/${id}`,{
        email:'soka@ru',
        newsid: 56,
        comment: "messi was good!!!!!"
    })
    expect(response.status).toBe(200)
    try{
        response = await axios.delete(`http://localhost:3000/comments/${id}`,{
        email:'soka@ru',
        newsid: 56,
        comment: "messi was good!!!!!"
    })
    expect(true).toBe(false)
    }
    catch (error){
        expect(error.response.status).toBe(404)
    }
})

