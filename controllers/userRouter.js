const express = require("express")
const router = express.Router()
const orderModel = require("../models/orderModel")

router.post("/place_order",async(req,res)=>{
    
    let data = req.body
    let orderModelObj = new orderModel(data)
    console.log(data)
    let result = await orderModelObj.save()
    res.json({
        "status":"success"
    })
})

//router.length("/view_my_orders")

module.exports = router