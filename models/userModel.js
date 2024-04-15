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
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:"0"
            // 0 user, 1 admin
        }
    }
)

module.exports = mongoose.model("users",userSchema)