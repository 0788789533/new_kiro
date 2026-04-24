const Order = require('../model/order');
const Product = require('../model/product');
const History = require('../model/history');

// GET all orders for logged-in user
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name price image')
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET single order
const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
            .populate('items.product', 'name price image');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// CREATE order
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0 || !shippingAddress) {
            return res.status(400).json({ message: 'items and shippingAddress are required' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
            totalAmount += product.price * item.quantity;

            // reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({ user: req.user.id, items: orderItems, totalAmount, shippingAddress });
        await order.save();

        await History.create({
            user: req.user.id,
            action: 'CREATE_ORDER',
            description: `Placed order of $${totalAmount.toFixed(2)}`,
            reference: order._id,
            referenceModel: 'Order',
        });

        res.status(201).json({ message: 'Order placed', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        await History.create({
            user: req.user.id,
            action: 'UPDATE_ORDER_STATUS',
            description: `Order status changed to: ${status}`,
            reference: order._id,
            referenceModel: 'Order',
        });

        res.status(200).json({ message: 'Order updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// CANCEL order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        // restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }

        order.status = 'cancelled';
        await order.save();

        await History.create({
            user: req.user.id,
            action: 'CANCEL_ORDER',
            description: `Cancelled order`,
            reference: order._id,
            referenceModel: 'Order',
        });

        res.status(200).json({ message: 'Order cancelled', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, cancelOrder };
