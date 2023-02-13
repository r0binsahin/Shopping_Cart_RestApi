const express = require("express");

const router = express.Router();
const {
  getAllCarts,
  getCartById,
  createNewCart,
  updateCartById,
  deleteCartById,
  deleteOneProductFromCart,
  emptyCart
} = require("../controllers/cartController");

router.get("/", getAllCarts);
router.get("/:cartId", getCartById);
router.post("/", createNewCart);
router.put("/:cartId", updateCartById);
router.delete("/:cartId", deleteCartById);
router.delete("/:cartId/products/:productId", deleteOneProductFromCart)
router.delete("/:cartId/products", emptyCart)

module.exports = router;