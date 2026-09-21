require("dotenv").config();
const express = require('express')
const connectDB = require('./config/database')
const app = express()
const Product = require('./models/Product')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
connectDB()

app.use('/',productRoute)
app.use('/', cartRoute)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})