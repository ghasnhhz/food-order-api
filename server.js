require("dotenv").config({quiet: true})
const express = require("express")
const menu = require("./routes/menu") 
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use("/menu", menu)


app.listen(PORT, () => {
  console.log("App is listening on: http://localhost:3000")
})