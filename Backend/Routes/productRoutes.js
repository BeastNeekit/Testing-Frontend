// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// POST a new product
router.post('/', async (req, res) => {
    try {
        const { name, image, price} = req.body;

        const newProduct = new Product({
            name,
            image,
            price,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});
router.get('/', async (req, res) => {
    try {
        // Fetch all products from the database (assuming Product.find() returns all products)
        const products = await Product.find();

        // Respond with the products as JSON
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

module.exports = router;
