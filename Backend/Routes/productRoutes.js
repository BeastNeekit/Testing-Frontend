const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// POST a new product
router.post('/', async (req, res) => {
    try {
        const { name, image, price, updateTime, category } = req.body;

        if (!name || !price || !updateTime || !category) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const newProduct = new Product({
            name,
            image,
            price,
            updateTime,
            category,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// GET product by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        const product = await Product.findOne({ name });
        if (product) {
            res.json([product]);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching product by name:', error);
        res.status(500).json({ message: 'Error fetching product by name' });
    }
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, price, updateTime, category } = req.body;

        if (!name || !price || !updateTime || !category) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, image, price, updateTime, category },
            { new: true }
        );

        if (updatedProduct) {
            res.json({ message: 'Product updated successfully', updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

module.exports = router;
