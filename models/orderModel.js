const mongoose = require("mongoose")

const orderSchema = mongoose.Schema(
    {
        customerId:{
            type:String,
            required:true
        },
        dishName:{
            type:String,
            required:true
        },
        count:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        },
        orderStatus:{
            type:String,
            default:"notServed"
        }
         
    }
)
module.exports = mongoose.model("orders",orderSchema)