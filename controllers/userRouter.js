const express = require("express")
const router = express.Router()
const orderModel = require("../models/orderModel")
const dishModel = require("../models/dishModel")
const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const cartModel = require("../models/cartModel")

hashedPasswordGenerator = async(pass) =>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

router.post("/signUp",async(req,res)=>{

    let {data} = { "data" : req.body }
    let password = data.password

    const hashedPassword = await hashedPasswordGenerator(password)
    data.password = hashedPassword
    data.role = "0"
    let userModelObj = new userModel(data)
    let result = userModelObj.save()
    res.json(
        {
            status:"success"
        }
    )


})

router.post("/place_order",async(req,res)=>{
    
    let data = req.body
    let userId = data.userId
    let orderModelObj = new orderModel(data)
    console.log(data)
    let result = await orderModelObj.save()
    //console.log(result)
    let txnId = result.transactionId

    let cartResult = await cartModel.find({ "userId": userId , "orderStatus":"0" });
    console.log(cartResult)

    cartResult.forEach(order => {
        order.orderStatus = '1';
        order.transactionId = txnId;  // Add your desired new field and value
        order.save(); // Save each updated order
    })


    if(result){
        res.json({
            "status":"success"
        })
    }else{
        res.json({
            "status":"failed"
        })
    }

})

router.get("/viewMenu",async(req,res)=>{

    let data = await dishModel.find()
    res.json(data)
})

router.post("/view_my_orders", async (req, res) => {
    try {
        const userId = req.body.userId;
        //console.log(userId);
        
        // Find orders for the given userId
        const orders = await orderModel.find({"userId": userId});
        //console.log(orders)
        
        // If no orders found, return "no orders" status
        if (!orders || orders.length === 0) {
            return res.json({"status": "no orders"});
        }
        
        // Object to store orders with details grouped by transactionId
        let ordersWithDetails = {};

        // Iterate over each order to find details from cartModel
        for (const order of orders) {
            console.log("order:",order)
            // Find carts for the current order's transactionId
            console.log(order.transactionId)
            const carts = await cartModel.find({"userId": userId, "transactionId": order.transactionId});
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
            ordersWithDetails[order.transactionId].push({...order._doc, details});
        }

        // Convert ordersWithDetails object to an array
        const result = Object.values(ordersWithDetails);

        // Send orders with details as response
        console.log(result);
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({"status": "error", "message": "Internal server error"});
    }
});



router.post("/login",async(req,res)=>{

    let input = req.body
    console.log(input)
    let email = req.body.email
    let data = await userModel.findOne({"email_id":email})
    //console.log(data)

    if(!data){
        return res.json({"status":"invalid username/password"})
    }else{
        //console.log(data)
        let dBpassword = data.password
        let inputPassword = req.body.password

        const match = await bcrypt.compare(inputPassword,dBpassword)
        if(!match){
            res.json({
                "status":"invalid username/password"
            })
        }else{
            res.json({
                "_id":data._id,
                "name":data.name,
                "role":data.role
            })
        }
    }

})

router.post("/addToCart",async(req,res)=>{
    
    let dishId = req.body.dishId
    let userId = req.body.userId
    const data = await cartModel.findOne({
        "dishId": dishId,
        "userId": userId,
    })
    if(data){
        data.count = req.body.count
        let result = await data.save()
        console.log(result)
        if(result){
            res.json({
                "status":"success"
            })
        }else{
            res.json({
                "status":"failed"
            })
        }
    }else{
        let input = req.body
        let cartModelObj = new cartModel(input)
        let result = await cartModelObj.save()
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
    
})

// router.post("/getMyCart",async(req,res)=>{

//     let id = req.body.id
//     let data = await cartModel.find(id)
//     .populate()
//     .exec()
  
//     if(data){
//         res.json(data)
//     }
//     else{
//         res.json({
//             "status":"failed"
//         })
//     }
    
// })

router.post("/getMyCart", async (req, res) => {
    try {
        let id = { "userId":req.body.userId }
        // Find documents in the carts collection based on the provided id
        let cartData = await cartModel.find(id);
        const filteredCartData = cartData.filter(cartItem => cartItem.orderStatus === "0");
        //console.log(filteredCartData)
        //console.log(id)
        // Populate the dishId field in each document with data from the dishes collection
        let populatedData = await cartModel.populate(filteredCartData, {
            path: 'dishId',
            model: 'dishes',
            select: 'name image price' // Specify the fields you want to select from the dishes collection
        });

        const result = []
        for (const item of populatedData) {
            // console.log("item.userId:",item.userId)
            // console.log("id:",id.userId)
            if (item.userId == id.userId) {
                result.push(item);
            }
        }
        console.log(result)

        // Send the populated data as a response
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "status": "failed" });
    }
});


module.exports = router