import React, { useState } from 'react';
import { backUrl } from "../../Urls";


const ProductForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [updateTime, setUpdateTime] = useState(new Date().toISOString().slice(0, 16)); // Initial value with current time

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation (you can add more as needed)
        if (!name || !image || !price || !updateTime ) {
            alert('Please fill in all fields.');
            return;
        }

        const newProduct = {
            name,
            image,
            price: parseFloat(price),
            updateTime,
        };

        try {
            // Send a POST request to your backend API
            const response = await fetch(`${backUrl}/products`, {
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            // Clear form fields after successful submission
            setName('');
            setImage('');
            setPrice('');
            setUpdateTime(new Date().toISOString().slice(0, 16)); // Reset to current time

            // Trigger parent component's onSubmit function (passed as prop)
            onSubmit(newProduct);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };


    return (

        <form onSubmit={handleSubmit} className="product-form">
            <h3>Add Product</h3>
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
                required
            />


            <button type="submit">Add Product</button>
        </form>


    );
};

export default ProductForm;