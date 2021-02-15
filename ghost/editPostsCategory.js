const fs = require('fs')
const GhostAdminAPI = require('@tryghost/admin-api');
const rawdata = fs.readFileSync('./confadmin.json');
const configdata = JSON.parse(rawdata)
let api;

if(configdata.apiurl!=='firstlogin'){
     api = new GhostAdminAPI({
    url:configdata.apiurl,
    key: configdata.adminApiKey,
    version: 'v3'
   });
}


module.exports= async function editCategory(data){
  let filteredArray

   await api.posts.browse({custom_excerpt:true})
    .then(response =>{
        const transformedArray = response.map(item => {
            let cat
            try {
                cat=JSON.parse(item.custom_excerpt)
            } catch (error) {
            }
                return {
                   id:item.id,
                   categoryid:cat?.category?.id,
                   custom_excerpt:item.custom_excerpt,
                   updated_at:item.updated_at
                }
        })
        filteredArray = transformedArray.filter(item => item?.categoryid === data.id)
        filteredArray =filteredArray.map(item=>{
            let excerpt=JSON.parse(item.custom_excerpt)
            if(data.name){
            excerpt.category.title=data.name
            excerpt.category.path=data.path
            }else{
               excerpt.category={} 
            }
   
            excerpt=JSON.stringify(excerpt)
            api.posts.edit({
                id:item.id,
                updated_at:item.updated_at,
                custom_excerpt:excerpt
            })
            .then(response => console.log('post ctegory edited'))
            .catch(error => console.error(error))

        })

    }).catch(error => console.error(error));



}