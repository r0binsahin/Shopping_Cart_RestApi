const express = require("express");

const router = express.Router();
const {
  getAllCarts,
  getCartById,
  createNewCart,
  updateCartById,
  addProductToCart,
  deleteCartById,
  deleteOneProductFromCart
} = require("../controllers/cartController");

router.get("/", getAllCarts);
router.get("/:cartId", getCartById);
router.post("/", createNewCart);
router.put("/:cartId", updateCartById);
router.put("/:cartId/products", addProductToCart)
router.delete("/:cartId", deleteCartById);
router.delete("/:cartId/products", deleteOneProductFromCart)



module.exports = router;