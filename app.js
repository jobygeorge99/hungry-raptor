const cors = require("cors")
const mongoose = require("mongoose")
const express = require("express")
const adminRouter = require("./controllers/adminRouter")

//alias
const app = express()

//middleware
app.use(cors())
app.use(express.json())

app.use("/api/admin",adminRouter)

app.listen("3001",()=>{
    console.log("server running")
})