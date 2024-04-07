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
        orderstatus:{
            type:String,
            default:"0"
        }
        // 
    }
)
module.exports = mongoose.model("orders",orderSchema)