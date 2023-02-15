const { NotFoundError, BadRequestError} = require('../utils/errors')
const Cart = require ('../models/Cart')
const Product = require('../models/Product')

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
    .populate('productId')
  
    if (!cart) throw new NotFoundError("This cart does not exist");
  
    return res.json(cart);
  };
  
//--------------------------------------------//
  exports.createNewCart = async (req, res) => {
    const cartName = req.body.cartName;
    const totalPrice = req.body.totalPrice || 0;
    const productId= req.body.productId || [];
    

    if (!cartName || cartName.toString().length === 0) throw new BadRequestError("You must provide a  name");

  
    const newCart = await Cart.create({
      cartName: cartName,
      totalPrice: totalPrice,
      productId: productId
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
        productId
    } = req.body;
  
  
    if (!cartName)
      throw new BadRequestError(
        "You must provide a name"
      );
  
    const cartToUpdate = await Cart.findById(cartId);
    if (!cartToUpdate) throw new NotFoundError("This cart does not exist");
  
    if (cartName) cartToUpdate.cartName = cartName;
    if (totalPrice) cartToUpdate.totalPrice = totalPrice;
    if (productId) cartToUpdate.productId = productId;
 
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
    const _id = req.body.productId
    //const productPrice = req.body.productPrice
    const cart = await Cart.findById(cartId)

    const products = cart.productId
    
    products.push(_id)
    
    await cart.populate('productId')

    let totalPrice = 0;
    products.forEach(product =>{
      totalPrice += product.productPrice;
    })

    cart.totalPrice = totalPrice;

    if (!cart) throw new NotFoundError("This cart does not exist");

    await cart.save();

  

    return res.json(cart)
  } 
  
  //-----------------------------------//
  exports.deleteOneProductFromCart = async(req, res)=> {
    const cartId = req.params.cartId;
    const productId = req.body.productId
    const cart = await Cart.findById(cartId);
    if (!cart) throw new NotFoundError("This cart does not exist");

    const products = cart.productId

    const removeProductById = (products, productId)=>{      
      const findIndex = products.findIndex((products)=>products?._id == productId)

      if(findIndex> -1){
        products.splice(findIndex, 1)
      }
    }
    removeProductById(products, productId)

    let totalPrice = 0;
    products.forEach(product =>{
      totalPrice += product.productPrice;
    })

    cart.totalPrice = totalPrice;
    await cart.save();
    const cartRes = await cart.populate('productId')
    return res.json(cartRes)
  }

  

