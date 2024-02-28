const mongoose = require("mongoose")

const dishSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        image:{
            type:String
        },
        date:
        {
            type:Date,
            default:Date.now
        }
    }
)

module.exports = mongoose.model("dishes",dishSchema)