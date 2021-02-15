const fs = require('fs')
const axios=require('axios')
const GhostToken= require('../authService/GhostToken')
const RefreshToken=require('../authService/RefreshToken')

class AuthorizationControler{
    constructor(){
    
    }

 async  session (req, res){
    const rawdata = fs.readFileSync('./confadmin.json');
    const configdata = JSON.parse(rawdata)
    const url=configdata.apiurl
    const adminApiKey=configdata.adminApiKey
    let statusobj={
            status:500,
            adminApiKeyAbsent:false,
            success:false,
            error:'API URL &&& Admin Api key dont exist',
            url:url,
            exp:undefined
        }
      
    if(configdata.adminApiKey==='firstlogin' && configdata.apiurl==='firstlogin'){
        statusobj.adminApiKeyAbsent=true
        statusobj.error='enter your Admin data'
        statusobj. status=200
        statusobj.refreshToken =await RefreshToken()
        res.status(200).send(statusobj)
    }else{
       let value=req.body
         statusobj.ghostToken = await GhostToken()
         statusobj.refreshToken =await RefreshToken()
         statusobj.exp= Date.now()+3590000
        const options = { headers: { 'Content-Type': 'application/json', }  };
        
                 await axios.post(`${url}/ghost/api/v3/admin/session`,value,options)
                  .then((response) => {
                      statusobj.status=200,
                      statusobj.success=true
                      statusobj.adminApiKey=adminApiKey
                      statusobj.error=""
                  })
                  .catch(error =>{
                    statusobj.refreshToken=''
                     if(!error.response){
                        statusobj.status=500,
                        statusobj.error="server not found check your ghost Server"
                        statusobj.success=false
                     }else{ 
                          statusobj.status=error.response.status
                          statusobj.success=false
                          statusobj.error=error.response.statusText
                        }
                  } )
                  
           res.status(statusobj.status).send(statusobj)
    }
    }

    
 }
module.exports= new AuthorizationControler