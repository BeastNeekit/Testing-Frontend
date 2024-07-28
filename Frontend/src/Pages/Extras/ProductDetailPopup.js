import React from 'react';
import '../../css/rate.css';
import {formatToNepaliDigits} from "./utils";

const ProductDetailPopup = ({ product, onClose }) => (
    <div className="popup">
        <div className="popup-content">
            <span className="close" onClick={onClose}>&times;</span>
            <h2><strong>{product.name}</strong></h2>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>मूल्य: {formatToNepaliDigits(product.price.toString())} रु</p>
            <p>प्रवेश समय: {formatToNepaliDigits(product.formattedUpdateTime.toString())}</p>
        </div>
    </div>
);

export default ProductDetailPopup;
