const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosControllers');

router.get('/', proyectosController.getProyects);

router.post('/', (req,res)=>{
    if(req.body.action){
        switch (req.body.action) {
            case "create":
                proyectosController.insertProyect(req, res);
                break;
        
            default:
                break;
        }
    }
})

module.exports = router;