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

router.post("/removeDish",async(req,res)=>{

    let data = req.body
    let result = await dishModel.deleteOne(data)
    res.json(
        {
            "status":"success"
        }
    )
})

router.post("/updateDishNum",async(req,res)=>{

    let {id,...rest} = req.body
    let result = await dishModel.updateOne(
        {_id:id},
        rest
    )
    res.json(
        {
            "status":"success"
        }
    )
})

router.get("/pendingOrders",async(req,res)=>{

    let data = await orderModel.find(
        {
            "orderStatus":"0"
        }
    )
    res.json(data)

})

router.get("/fulfilledOrders",async(req,res)=>{

    let data = await orderModel.find(
        {
            "orderStatus":"1"
        }
    )
    res.json(data)

})

module.exports = router