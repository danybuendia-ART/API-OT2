const express = require('express');
const router = express.Router();
const evidencesController = require("../controllers/evidencesController");

router.post("/", (req, res)=>{
    if(req.body.action){
        switch (req.body.action) {
            case "DeleteEvidences":
                evidencesController.DeleteEvidences(req, res);
                break;
            default:
                break;
        }
    }
})

module.exports = router;