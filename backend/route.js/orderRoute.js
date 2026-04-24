const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getOrders, getOrder, createOrder, updateOrderStatus, cancelOrder } = require('../controller/orderController');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
