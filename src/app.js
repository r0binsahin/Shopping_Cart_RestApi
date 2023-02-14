require("dotenv").config();
require("express-async-errors");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const { notFoundMiddleware } = require("./middleware/notFoundMiddleware");
const express = require("express");
const mongoose = require("mongoose");
const cartRoutes = require('./routes/cartRoutes')
const productRoutes = require('./routes/productRoutes')



const app = express()
app.use(express.json())

app.use((req, res, next) => {
    console.log(`Processing ${req.method} request to ${req.path}`);
    next();
  });

  
  app.use("/helloWorld", (req, res) => {
    return res.send("Hello World!");
  }); 

  app.use('/api/v1/carts', cartRoutes)
  app.use('/api/v1/products', productRoutes)
  
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  const port = process.env.PORT || 5000;

  async function run() {
    try {

      mongoose.set("strictQuery", false);
      const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
      console.log(`MongoDB connected: ${conn.connection.host}`);
  
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  run();
