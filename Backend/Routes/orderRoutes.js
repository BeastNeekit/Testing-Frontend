const express = require('express');
const router = express.Router();
const Order = require('../model/Order');


router.post('/try', async (req, res) => {
    const { id, customerName, productName, paidNumber, paymentStatus, status, date } = req.body;

    const newOrder = new Order({
        id,
        customerName,
        productName,
        paidNumber,
        paymentStatus,
        status,
        date,
    });

    try {
        await newOrder.save();
        res.status(201).json({ message: 'Order added successfully', order: newOrder });
    } catch (error) {
        res.status(400).json({ message: 'Error adding order', error });
    }
});


router.get('/try', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
