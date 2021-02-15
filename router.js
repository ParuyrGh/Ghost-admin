const expres = require('express')
const router= expres.Router()
const AuthorizationController = require('./controllers/AuthorizationController');
const CategoryController = require('./controllers/CategoryController');
const ConfigController = require('./controllers/ConfigController');
const {checkBody,checkParam} = require('./validation/categoryValidation')

    


router.post('/api/v1/session', AuthorizationController.session );
router.post('/api/v1/configchange', ConfigController.configchange );

router.get('/api/v1/category', CategoryController.category );
router.post('/api/v1/category', checkBody, CategoryController.addcategory );    
router.get('/api/v1/category/:id', checkParam ,CategoryController.categorybyid );
router.patch('/api/v1/category/:id', checkParam,checkBody,CategoryController.editcategory );
router.delete('/api/v1/category/:id', checkParam ,CategoryController.categorydelete );



router.get(/.*/,(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
    } )
    
router.get('/dashboard',(req,res)=>{
    res.sendFile(__dirname+'/admin/index.html')
    } )
 

module.exports=router       