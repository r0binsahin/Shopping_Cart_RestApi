const express = require("express");

const router = express.Router();
const {
    getAllProducts,
    getProductById,
    showProductsInCart
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.get("/carts/:cartId/products", showProductsInCart);

module.exports = router;