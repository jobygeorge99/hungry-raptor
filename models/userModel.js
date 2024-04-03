const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email_id:{
            type:String,
            required:true
        },
        registered_on:{
            type:Date,
            default:Date.now
        }
    }
)

module.exports = mongoose.model("users",userSchema)