const express = require("express");

const router = express.Router();
const {
  getAllCarts,
  getCartById,
  createNewCart,
  updateCartById,
  addProductToCart,
  deleteCartById,
  deleteOneProductFromCart,
  emptyCart,

} = require("../controllers/cartController");

router.get("/", getAllCarts);
router.get("/:cartId", getCartById);
router.post("/", createNewCart);
router.put("/:cartId", updateCartById);
router.put("/:cartId/productId", addProductToCart)
router.delete("/:cartId", deleteCartById);
router.delete("/:cartId/productId", deleteOneProductFromCart)



module.exports = router;