const { NotFoundError, BadRequestError } = require("../utils/errors");
const Cart = require('../models/Cart')
const Product = require('../models/Product')

exports.getAllProducts = async (req, res) => {
    const limit = Number(req.query?.limit || 10);
    const offset = Number(req.query?.offset || 0);

    const products =  await Product.find()
    .limit(limit)
    .skip(offset);

    if (!products) throw new NotFoundError("There are no products to show");

    const totalProductsInDatabase = await Product.countDocuments();

    return res.json({
        data: products,
        meta: {
          total: totalProductsInDatabase,
          limit: limit,
          offset: offset,
          count: products.length,
        },
      });
}

//--------------------------------------------------------------//
exports.getProductById = async (req, res) => {
    const productId = req.body.productId;
  
    const product = await Product.findById(productId);
  
    if (!product) throw new NotFoundError("This product does not exist");
  
    return res.json(product);
  };

  //--------------------------------------------------------------//

  exports.showProductsInCart = async(req, res) => {
    const cart = await Cart.find({}, { productId: true }) 

  const productDataOnly = [];

    cart.forEach((product) => {
    productDataOnly.push(product);
    });


  return res.json({
    data: productDataOnly,
    meta: {
      count: productDataOnly.length,
    },
  });
   
  }

