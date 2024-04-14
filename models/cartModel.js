const mongoose = require("mongoose")

const cartSchema = mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        dishId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"dishes" 
        },
        dishName:{
            type:String
        },
        count:
        {
            type:String,
            required:true
        },
        date:
        {
            type:Date,
            default:Date.now
        },
        orderStatus:
        {
            type:String,
            default:"0"
        },
        transactionId:{
            type:String,
            default:""
        }
    }
)

module.exports = mongoose.model("carts",cartSchema)