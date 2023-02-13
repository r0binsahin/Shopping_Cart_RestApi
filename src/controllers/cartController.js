const { NotFoundError, BadRequestError} = require('../utils/errors')
const Cart = require ('../models/Cart')

//--------------------------------------------//
exports.getAllCarts = async (req, res) => {
    const limit = Number(req.query?.limit || 10);
    const offset = Number(req.query?.offset || 0);

    const carts = await await Cart.find()
    .limit(limit)
    .skip(offset);

    if (!carts) throw new NotFoundError("There are no carts to show");

    const totalCartsInDatabase = await Cart.countDocuments();

    return res.json({
        data: Cart,
        meta: {
          total: totalCartsInDatabase,
          limit: limit,
          offset: offset,
          count: carts.length,
        },
      });
}

//--------------------------------------------//
exports.getCartById = async (req, res) => {
    const cartId = req.params.cartId;
  
    const cart = await Cart.findById(cartId);
  
    if (!cart) throw new NotFoundError("This cart does not exist");
  
    return res.json(cart);
  };
  
//--------------------------------------------//
  exports.createNewCart = async (req, res) => {
    const cartName = req.body.cartName;
    const totalPrice = req.body.totalPrice || 0;
    const products= req.body.products || [];
    

    if (!cartName) throw new BadRequestError("You must provide a  name");

  
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
  exports.deleteOneProductFromCart = async(req, res)=> {
    return null
  }

  //-----------------------------------//
  exports.emptyCart = async(req, res)=> {
    return null
  }

  /*
  //-----------------------------------//
  exports.addProductToCart = async(req, res)=> {

    return null
  } */