const Product = require('../model/product');
const History = require('../model/history');

// GET all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('createdBy', 'firstname lastname email');
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('createdBy', 'firstname lastname email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// CREATE product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'name, description, price and category are required' });
        }
        const product = new Product({ name, description, price, stock, category, image, createdBy: req.user.id });
        await product.save();

        await History.create({
            user: req.user.id,
            action: 'CREATE_PRODUCT',
            description: `Created product: ${name}`,
            reference: product._id,
            referenceModel: 'Product',
        });

        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        await History.create({
            user: req.user.id,
            action: 'UPDATE_PRODUCT',
            description: `Updated product: ${updated.name}`,
            reference: updated._id,
            referenceModel: 'Product',
        });

        res.status(200).json({ message: 'Product updated', product: updated });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);

        await History.create({
            user: req.user.id,
            action: 'DELETE_PRODUCT',
            description: `Deleted product: ${product.name}`,
        });

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
