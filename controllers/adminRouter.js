const express = require("express")
const dishModel = require("../models/dishModel")
const router = express.Router()

router.post("/addDish",async (req,res)=>{

    let data = req.body
    let dishObj = new dishModel(data)
    console.log(data)
    let result = await dishObj.save()
    res.json(
        {
            "status": "success"
        }
    )
})

module.exports = router