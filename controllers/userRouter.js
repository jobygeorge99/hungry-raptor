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
    let orderModelObj = new orderModel(data)
    console.log(data)
    let result = await orderModelObj.save()
    res.json({
        "status":"success"
    })
})

router.get("/viewMenu",async(req,res)=>{

    let data = await dishModel.find()
    res.json(data)
})

router.post("/view_my_orders",async(req,res)=>{

    let id = req.body._id
    console.log(id)
    let result = await orderModel.find({"customerId":id})
    if(!result || result.length === 0)
    {
        res.json(
            {
                "status":"no orders"
            }
        )
    }
    else
    {
        res.json(result)
    }
})

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
    let data = await cartModel.findOne({"dishId":dishId})
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
        let id = req.body.id;

        // Find documents in the carts collection based on the provided id
        let cartData = await cartModel.find(id);
        console.log(cartData)
        // Populate the dishId field in each document with data from the dishes collection
        let populatedData = await cartModel.populate(cartData, {
            path: 'dishId',
            model: 'dishes',
            select: 'name image price' // Specify the fields you want to select from the dishes collection
        });

        // Send the populated data as a response
        res.json(populatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "status": "failed" });
    }
});


module.exports = router