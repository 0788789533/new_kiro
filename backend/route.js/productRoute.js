const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controller/productController');

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
