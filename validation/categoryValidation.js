const fs = require('fs')
const {check,param} = require('express-validator')


module.exports= {

    checkBody: [
            check('name').notEmpty().withMessage('Fill Category Name')
            .isLength({ min: 3 }).withMessage('Enter minimum 3 Sybols').trim(),
            check('path').notEmpty().withMessage('Fill Category Path').toLowerCase().trim()
            .custom(async( value,{req}) =>{

            const rawdata = fs.readFileSync('./data/categorys.json');
            const data = JSON.parse(rawdata)
            let exist=false
            data.categorys.map(e=>{
                if(e.path===value || e.name===req.body.name){
                    exist=true
                }
            })
            if(String(req.body.name).toLowerCase().split(' ').join('_')!==value){
                exist=true
            }
            if(exist){
                return Promise.reject()
            }
        }).withMessage('Category or category NAme or Path Already exist')
        
        ],
    checkParam:[
            param('id').notEmpty().withMessage('Fill category id')
            .custom( async value=>{
                value=Number(value) 
                const rawdata = await fs.readFileSync('./data/categorys.json');
                const data = JSON.parse(rawdata)
                let notexist=true

                data.categorys.map(e=>{
                        if(e.id===value){
                            notexist=false
                        }
                    })
                if(notexist){
                        return Promise.reject()
                    }
           }).withMessage('Enter currect ctegory id')
        ],


}