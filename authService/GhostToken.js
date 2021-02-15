const jwt = require('jsonwebtoken');
const fs = require('fs')




module.exports= async function generateAccessToken(){

const rawdata = fs.readFileSync('./confadmin.json');
const configdata = JSON.parse(rawdata)
let [id, secret] = configdata.adminApiKey.split(':');


 let token=  await jwt.sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: `/v3/admin/`
     });
     return    token
}