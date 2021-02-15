const expres = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const axios=require('axios')



class ConfigControler{
    constructor(){
    
    }

    async configchange (req,res){
        let statusobj={
            status:404,
            adminApiKeyAbsent:true,
            success:false,
            url:'',
            error:'enter curect data',
            exp:undefined
        }
        let value=req.body
        if(value.url && value.adminApiKey && value.username && value.password && typeof value.adminApiKey==='string'&& value.adminApiKey.indexOf(':')!==-1){
        let [id, secret] = value.adminApiKey.split(':');
        let ghostToken = jwt.sign({}, Buffer.from(secret, 'hex'), {
               keyid: id,
               algorithm: 'HS256',  
               expiresIn: '5m',
               audience: `/v3/admin/`
            });
            statusobj.exp= Date.now()+3590000
          const headers = { Authorization: `Ghost ${ghostToken}` };
         await axios.get(`${value.url}/ghost/api/v3/admin/posts/`,  { headers })
                 .then(response => {
                     statusobj.status=200
                     statusobj.success=true
                     statusobj.adminApiKeyAbsent=false
                     statusobj.url=value.url
                     statusobj.adminApiKey=adminApiKey 
                     statusobj.error=''
                 })
                 .catch(error => {
                      if(!error.response){
                         statusobj.status=500,
                         statusobj.error="server not found check your ghost Server"
                         statusobj.success=false
                      }else{ 
                           statusobj.status=404
                           statusobj.success=false
                           statusobj.error='check your Admin Api key or Api URL'
                         }
                 });
             if(statusobj.success){
              const options = { headers: {   'Content-Type': 'application/json', }  };
                  await axios.post(`${value.url}/ghost/api/v3/admin/session`,{username:value.username,password:value.password},options)
                   .then((response) => {
                       let data = JSON.stringify({
                         adminApiKey:value.adminApiKey,
                         apiurl:value.url
                       }) 
                       console.log(data)
                       fs.writeFileSync('./confadmin.json', data)
                   })
                   .catch(error =>{
                      if(!error.response){
                         statusobj.status=500,
                         statusobj.error="server not found check your ghost Server"
                         statusobj.success=false
                      }else{ 
                           statusobj.status=404
                           statusobj.success=false
                           statusobj.error='enter curect username or passvord'
                         }
                   } )
             }
        }
        res.status(statusobj.status).send(statusobj)
    } 

   
      
 }

module.exports= new ConfigControler 