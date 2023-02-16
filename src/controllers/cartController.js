const { NotFoundError, BadRequestError} = require('../utils/errors')
const Cart = require ('../models/Cart')
const Product = require('../models/Product')
const { products } = require('../../seedDB/products')

//--------------------------------------------//
exports.getAllCarts = async (req, res) => {

    const carts = await await Cart.find()

    if (!carts) throw new NotFoundError("There are no carts to show");

    const totalCartsInDatabase = await Cart.countDocuments();

    return res.json({
        data: carts,
        meta: {
          total: totalCartsInDatabase,
          count: carts.length,
        },
      });
}

//--------------------------------------------//
exports.getCartById = async (req, res) => {
    const cartId = req.params.cartId;
  
    const cart = await Cart.findById(cartId)
    .populate('products.product')
  
    if (!cart) throw new NotFoundError("This cart does not exist");
  
    return res.json(cart);
  };
  
//--------------------------------------------//
  exports.createNewCart = async (req, res) => {
    const cartName = req.body.cartName;
    const totalPrice = req.body.totalPrice || 0;
    const products= req.body.products || [];
    

    if (!cartName || cartName.toString().length === 0) throw new BadRequestError("You must provide a  name");

  
    const newCart = await Cart.create({
      cartName: cartName,
      totalPrice: totalPrice,
      products: products
    });
  
    return res
      .setHeader(
        "Location",
        `http://localhost:${process.env.PORT}/api/v1/carts/${newCart._id}`
      )
      .status(201)
      .json(newCart);
  };

  //--------------------------------------------//
  exports.updateCartById = async (req, res) => {
    const cartId = req.params.cartId;
  
    const {
        cartName,
        totalPrice,
        products
    } = req.body;
  
  
    if (!cartName)
      throw new BadRequestError(
        "You must provide a name"
      );
  
    const cartToUpdate = await Cart.findById(cartId);
    if (!cartToUpdate) throw new NotFoundError("This cart does not exist");
  
    if (cartName) cartToUpdate.cartName = cartName;
    if (totalPrice) cartToUpdate.totalPrice = totalPrice;
    if (products) cartToUpdate.products = products;
 
    const updatedCart = await cartToUpdate.save();

    return res.json(updatedCart);
  };

  //-----------------------------------//
exports.deleteCartById = async (req, res) => {
    const cartId = req.params.cartId;
    const cartToDelete = await Cart.findById(cartId);
    if (!cartToDelete) throw new NotFoundError("This cart does not exist");
  
    await cartToDelete.delete();
  
    return res.sendStatus(204);
  };
    
  //-----------------------------------//
  exports.addProductToCart = async(req, res)=> {
    const cartId = req.params.cartId;
    const pId= req.body.pId
    let quantityToAdd= req.body.quantity || 1
    const cart = await Cart.findById(cartId)

    if (!cart) throw new NotFoundError("This cart does not exist");

    const products = cart.products

    const existingProductIndex = products.findIndex((product)=> product.product == pId)

    if(existingProductIndex > -1){
      products[existingProductIndex].quantity += quantityToAdd
    } else {
      products.push({
        product: pId,
        quantity: quantityToAdd
      })
    }

    await cart.populate('products.product')

    let totalPrice = cart.totalPrice || 0;
    products.forEach(product =>{
      if (product.product._id == pId) {
        totalPrice += product.product.productPrice* quantityToAdd;
      }
    }) 
    cart.totalPrice = totalPrice;    

    await cart.save();

    return res.json(cart)
  } 
  
  //-----------------------------------//
  exports.deleteOneProductFromCart = async(req, res)=> {
    const cartId = req.params.cartId;
    const pId = req.body.pId
    let quantityToRemove = req.body.quantity || 1
    const cart = await Cart.findById(cartId);
    if (!cart) throw new NotFoundError("This cart does not exist");

    let products = cart.products
    await cart.populate('products.product')

    const productIndex = products.findIndex((product)=> product.product._id== pId)

    if(productIndex < 0)   throw  new BadRequestError("Already empty cart!") 

    if(products[productIndex].quantity > quantityToRemove) {
      products[productIndex].quantity  -= quantityToRemove

      let totalPrice = cart.totalPrice || 0;

      products.forEach(product =>{
        if (product.product._id == pId) {
          totalPrice -= product.product.productPrice* quantityToRemove;
        }
      }) 

      cart.totalPrice = totalPrice;  

    } else {
      cart.totalPrice -= products[productIndex].product.productPrice
    products.splice(productIndex, 1)
    }

    //await cart.populate('products.product')

    await cart.save();
    const cartRes = await cart.populate('products.product')
    return res.json(cartRes)
  }

  

