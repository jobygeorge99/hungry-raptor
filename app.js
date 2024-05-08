const cors = require("cors")
const mongoose = require("mongoose")
const express = require("express")
const adminRouter = require("./controllers/adminRouter")
const userRouter = require("./controllers/userRouter")

//alias
const app = express()

//middleware
// app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://jobydb:joby123@cluster0.czhpkmp.mongodb.net/hungry-raptor-DB?retryWrites=true&w=majority")

app.use("/api/admin",adminRouter)
app.use("/api/user",userRouter)

app.listen("3001",()=>{
    console.log("server running")
})
