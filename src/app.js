require("dotenv").config();
const express = require('express')
const connectDB = require('./config/database')
const app = express()
const Product = require('./models/Product')
const productRoute = require('./routes/product')

connectDB()

app.use('/',productRoute)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})