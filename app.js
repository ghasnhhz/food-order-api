require("dotenv").config({quiet: true})
const express = require("express")
const menu = require("./routes/menu") 
const orders = require("./routes/orders")
const errorHandler = require("./middlewares/errorHandler")
const app = express()

app.use(express.json())
app.use("/menu", menu)
app.use("/orders", orders)


app.use((req, res) => {
  res.status(404).json({error: "404 Not Found"})
})

app.use(errorHandler)

module.exports = app