require("dotenv").config();
const express = require('express')
const connectDB = require('./config/database')
const app = express()
const Product = require('./models/product')

connectDB()

app.post("/", async (req,res) => {
    const  p = new Product({
        name: "Product 1",
        price: 100,
        inventory: 10
    })
    await p.save()
    res.send("Hello World")
})

app.get("/", async (req,res) => {
    const products = await Product.find()
    res.send(products)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})