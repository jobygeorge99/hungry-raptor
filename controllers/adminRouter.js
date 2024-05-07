const express = require("express")
const dishModel = require("../models/dishModel")
const router = express.Router()
const orderModel = require("../models/orderModel")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")

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

router.post("/updateDishNum", async (req, res) => {
    try {
        let id = req.body._id;
        let data = await dishModel.findOne({"_id":id})
        if(data){
            data.count = req.body.count
            let result = data.save()
            if(result){
                res.json({
                    "status":"success"
                })
            }else{
                res.json({
                    "status":"failed"
                })
            }
        }
        
    } catch (error) {
        res.json({
            "status": "failed"
        });
    }
});

// to view all orders
router.get("/viewOrders",async(req,res)=>{

    let data = await orderModel.find()
    res.json(data)
})

router.get("/pendingOrders",async(req,res)=>{

    let orders = await orderModel.find(
        {
            "orderStatus":"notServed"
        }
    )
    if(orders){
        let ordersWithDetails = {};
        for (const order of orders) {
            console.log("order:",order)
            // Find carts for the current order's transactionId
            console.log(order.transactionId)
            const carts = await cartModel.find({"userId": order.userId, "transactionId": order.transactionId});
            const userModelResult = await userModel.find({"_id":order.userId})
            const name = userModelResult[0].name
            console.log("userModelResult:",userModelResult)
            // If carts found, populate data from carts
            console.log("carts",carts)
            const details = carts.map(cart => ({
                dishName: cart.dishName,
                count: cart.count
            }));
            // Add details to the corresponding transactionId in ordersWithDetails
            if (!ordersWithDetails[order.transactionId]) {
                ordersWithDetails[order.transactionId] = [];
            }
            ordersWithDetails[order.transactionId].push({...order._doc, details,name});
        }
        // Convert ordersWithDetails object to an array
        const result = Object.values(ordersWithDetails);

        // Send orders with details as response
        console.log(result);
        res.json(result);
    }

})

router.get("/fulfilledOrders",async(req,res)=>{

    let orders = await orderModel.find(
        {
            "orderStatus":"served"
        }
    )
    if(orders){
        let ordersWithDetails = {};
        for (const order of orders) {
            console.log("order:",order)
            // Find carts for the current order's transactionId
            console.log(order.transactionId)
            const carts = await cartModel.find({"userId": order.userId, "transactionId": order.transactionId});
            const userModelResult = await userModel.find({"_id":order.userId})
            const name = userModelResult[0].name
            console.log("userModelResult:",userModelResult)
            // If carts found, populate data from carts
            console.log("carts",carts)
            const details = carts.map(cart => ({
                dishName: cart.dishName,
                count: cart.count
            }));
            // Add details to the corresponding transactionId in ordersWithDetails
            if (!ordersWithDetails[order.transactionId]) {
                ordersWithDetails[order.transactionId] = [];
            }
            ordersWithDetails[order.transactionId].push({...order._doc, details,name});
        }
        // Convert ordersWithDetails object to an array
        const result = Object.values(ordersWithDetails);

        // Send orders with details as response
        console.log(result);
        res.json(result);
    }

})

router.post("/serveFood", async (req, res) => {
    try {
        let txnid = req.body.transactionId;
        let data = await orderModel.findOne({"transactionId":txnid, "orderStatus":"notServed"})
        if(data){
            data.orderStatus = "served"
            let result = data.save()
            if(result){

                let orders = await cartModel.find(
                    {
                        "transactionId":txnid
                    }
                )

                res.json(orders)
            }else{
                res.json({
                    "status":"failed"
                })
            }
        }
        
    } catch (error) {
        res.json({
            "status": "failed"
        });
    }
});

module.exports = router