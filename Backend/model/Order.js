const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    productNumber: { type: String }, // Adjust type as per your needs
    paidNumber: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
