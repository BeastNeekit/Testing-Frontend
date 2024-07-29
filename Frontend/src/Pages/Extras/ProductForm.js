import React, { useState } from 'react';
import { backUrl } from "../../Urls";

const ProductForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [updateTime, setUpdateTime] = useState(new Date().toISOString().slice(0, 16)); // Initial value with current time
    const [category, setCategory] = useState(''); // State for category
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !updateTime || !category) {
            alert('Please fill in all fields.');
            return;
        }

        const newProduct = {
            name,
            image,
            price: parseFloat(price),
            updateTime,
            category,
        };

        try {
            // Send a POST request to your backend API
            const response = await fetch(`${backUrl}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to add product');
            }

            // Clear form fields after successful submission
            setMessage({ type: 'success', text: result.message });
            setName('');
            setImage('');
            setPrice('');
            setUpdateTime(new Date().toISOString().slice(0, 16)); // Reset to current time
            setCategory(''); // Reset category

            // Trigger parent component's onSubmit function (passed as prop)
            onSubmit(newProduct);
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage({ type: 'error', text: 'Failed to add product' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h3>Add Product</h3>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <input
                placeholder="Product Name:"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                placeholder="Price:"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <input
                placeholder="Image URL:"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="" disabled>Select Category</option>
                <option value="cigarette">🚬 Cigarette</option>
                <option value="noodle">🍜 Noodle</option>
                <option value="beans">🫘 Beans</option>
                <option value="grain">🌾 Grains</option>
                <option value="soap">🧼 Soap</option>
                <option value="electronic">🔌 Electronic</option>
                <option value="drink">💧 Drink</option>
                <option value="sanity">⚕️Sanity</option>
                <option value="chocolate">🍫 Chocolate</option>
                <option value="biscuit">🍪 Biscuits</option>
                <option value="others">🛒 Others</option>

            </select>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm;
