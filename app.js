const cors = require("cors")
const mongoose = require("mongoose")
const express = require("express")

//alias
const app = express()

//middleware
app.use(cors())
app.use(express.json())


app.listen("3001",()=>{
    console.log("server running")
})