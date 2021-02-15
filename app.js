const express = require('express');
const app= express();
const cookie = require( 'cookie-parser' );
const bodyParser=require('body-parser');
const server=require('http').Server(app);
const router=require('./router')
const cors= require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
app.use( cookie() );
app.use(cors())
app.use(express.static('public'))
app.use(express.static('admin'))
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())
app.use(express.json())
app.use( cookie() );


app.use( async ( req, res, next ) => {

   if(req.method!=='GET'&& req.path!=='/api/v1/session'){

    let decoded;
        if(!req.headers.authorization){
            res.status(401).send({success:false,error:"Autorization failed"})
        }else{
            let tokenv =''+req.headers.authorization
            try{
                tokenv =tokenv.split(' ')[1]
                decoded = await jwt.verify(tokenv, Buffer.from('SecretApiKeyToken', 'hex')) 
                if(req.path==='/api/v1/checktoken'){
                   res.status(200).send({success:true, exp:decoded.exp*1000})
                }else next();
            }catch(err){
                 res.status(401).send({success:false,error:err}) 
            }
        }
   }else next();
 });
 


app.use(router)

server.listen(3040)
       