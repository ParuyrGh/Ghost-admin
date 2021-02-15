const jwt = require('jsonwebtoken');
const fs = require('fs')




module.exports= async function generateRefreshToken(){

const rawdata = fs.readFileSync('./confadmin.json');
const configdata = JSON.parse(rawdata)
let [id, secret] = configdata.adminApiKey.split(':');


 let token= await  jwt.sign({}, Buffer.from('SecretApiKeyToken', 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '1h',
    audience: `/v3/admin/`
 });
     return    token
}