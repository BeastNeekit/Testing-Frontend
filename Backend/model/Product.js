const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    updateTime: { type: Date, required: true }, // New field for update time
    category: {
        type: String,
        required: true,
        enum: [
            'cigarette',
            'noodle',
            'beans',
            'grain',
            'soap',
            'electronic',
            'drink',
            'sanity',
            'chocolate',
            'biscuit',
            'others'
        ] // New field for category with predefined values
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
