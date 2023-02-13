require("dotenv").config();

const mongoose = require("mongoose");
const CartMockData = require("./carts");
const ProductMockData = require("./products");
const Cart = require("../src/models/Cart"); 
const Product = require("../src/models/Product");

const populateDbWithMockData = async (connectionString) => {
  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(connectionString);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    await Cart.deleteMany();
    await Product.deleteMany();

    await Cart.create(CartMockData.carts);
    await Product.create(ProductMockData.products);

    console.log("Database successfully populated with test data");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

populateDbWithMockData(process.env.MONGO_CONNECTION_STRING);