import React, { useState, useEffect } from 'react';
import '../css/rate.css';
import ProductDetailPopup from './Extras/ProductDetailPopup';
import { backUrl } from "../Urls";
import { formatToNepaliDigits } from './Extras/utils';

const Rate = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backUrl}/products`); // Replace with your backend URL
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            // Format createdAt to display as 'YYYY-MM-DD'
            const formattedProducts = data.map(product => ({
                ...product,
                formattedUpdateTime: new Date(product.createdAt).toISOString().split('T')[0],
            }));
            // Sort products in descending order by creation date
            const sortedProducts = formattedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProducts(sortedProducts);
            setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage)); // Calculate total pages
        } catch (error) {
            console.error('Error fetching products:', error);
            // Handle error as needed (e.g., show error message)
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <div className="pagination">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="container">
            <h1><b>सामानको मूल्य</b></h1>
            <table className="rate-table">
                <thead>
                <tr>
                    <th>तस्बिर</th>
                    <th>सामानको नाम</th>
                    <th>मूल्य</th>
                    <th>प्रवेश समय</th>
                </tr>
                </thead>
                <tbody>
                {displayedProducts.map((product) => (
                    <tr key={product._id} onClick={() => handleRowClick(product)} style={{ cursor: 'pointer' }}>
                        <td>
                            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', marginLeft: '25%' }} />
                        </td>
                        <td>{product.name}</td>
                        <td>{formatToNepaliDigits(product.price.toString())}</td> {/* Format price to Nepali digits */}
                        <td>{formatToNepaliDigits(product.formattedUpdateTime.toString())}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination-controls">{renderPagination()}</div>
            {selectedProduct && <ProductDetailPopup product={selectedProduct} onClose={closeModal} />}
        </div>
    );
};

export default Rate;
