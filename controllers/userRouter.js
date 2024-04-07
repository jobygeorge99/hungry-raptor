const express = require("express")
const router = express.Router()
const orderModel = require("../models/orderModel")
const dishModel = require("../models/dishModel")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

hashedPasswordGenerator = async(pass) =>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

router.post("/signUp",async(req,res)=>{

    // check if the user already exists
    let email = req.body.email_id
    
    try{
        
        let user = await userModel.findOne({ "email_id":email });
        if (user) {
        return res.status(400).json({ msg: 'Email already exists' });
        }

        let {data} = { "data" : req.body }
        let password = data.password

        const hashedPassword = await hashedPasswordGenerator(password)
        data.password = hashedPassword

        let userModelObj = new userModel(data)
        let result = userModelObj.save()
        console.log(result)
        if(result){

            jwt.sign(
                result,
                process.env.JWT_SECRET,
                { expiresIn: '7 days' },
                (err, token) => {
                if (err) throw err;
                res.json({ token });
                }
            );
        }
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

    


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

    jwt.sign(
        result,
        process.env.JWT_SECRET,
        { expiresIn: '7 days' },
        (err, token) => {
        if (err) throw err;
        res.json({ token });
        }
    );

})

module.exports = router