import React from 'react';
import '../../css/rate.css'; // Import your CSS file for ProductDetailPopup styling

const ProductDetailPopup = ({ product, onClose }) => (
    <div className="popup">
        <div className="popup-content">
            <span className="close" onClick={onClose}>&times;</span>
            <h2><strong>{product.name}</strong></h2>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>Price: Rs.{product.price}</p>
            <p>Update Time: {product.formattedUpdateTime}</p>
        </div>
    </div>
);

export default ProductDetailPopup;
