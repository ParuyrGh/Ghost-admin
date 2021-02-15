const { validationResult} = require('express-validator')
const fs = require('fs')
const edittCategory= require('../ghost/editPostsCategory')

const dataRead= function(){
    const rawdata = fs.readFileSync('./data/categorys.json');
     return JSON.parse(rawdata)
    }



class CategoryControler{
    constructor(){
    
    }

async category  (req, res){
      const data =await dataRead()
    
      res.status(200).send(data.categorys)
    }

    
async addcategory(req,res){
    const error =validationResult(req)
    const err=error.errors
    if(!error.isEmpty()){
      res.status(400).send(err)
   
    }else{
       const data =await dataRead()
    
       data.categorys.push({
                 id:Date.now(),
                 name:req.body.name,
                 path:req.body.path
          })
        let wriedata=JSON.stringify(data)
        fs.writeFileSync('./data/categorys.json',  wriedata )
        res.status(201).send({sucsess:true})

    }
}

async editcategory(req,res){
     let id=Number(req.params.id)

     const error =validationResult(req)
     const err=error.errors
     if(!error.isEmpty()){
        res.status(400).send(err)
      }else{
        const data =await dataRead()
        data.categorys.map(e=>{
            if(e.id===id){
                e.name=req.body.name
                e.path=req.body.path
                edittCategory(e)
            }
        })
    let wriedata=JSON.stringify(data)
    fs.writeFileSync('./data/categorys.json',  wriedata )
    res.status(201).send({sucsess:true})
    }

}


 async categorybyid(req,res){

    const error =validationResult(req)
    const err=error.errors
    let id=Number(req.params.id)

    if(!error.isEmpty()){
      res.status(400).send(err)
    }else{
       const data =await dataRead()
       let category;
        data.categorys.map(e=>{
            if(e.id===id){
                category=e
            }
        })
        res.send(category)
    }
 }    
    
async categorydelete(req,res){
        let id=Number(req.params.id)
        const error =validationResult(req)
        const err=error.errors
        if(!error.isEmpty()){
            res.status(400).send(err)
        }else{
            const data =await dataRead()
            data.categorys.map(e=>{
                if(e.id===id){
                    edittCategory({id:e.id})
                }
            })
            let wriedata=JSON.stringify({categorys: data.categorys.filter(e=>e.id!==id) })
            await fs.writeFileSync('./data/categorys.json',  wriedata )
            res.send({sucsess:true})
        }
   }    

    
}
  module.exports= new CategoryControler