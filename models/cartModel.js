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
        count:
        {
            type:String,
            required:true
        },
        date:
        {
            type:Date,
            default:Date.now
        }
    }
)

module.exports = mongoose.model("carts",cartSchema)