import React, { useState, useEffect } from 'react';
import '../css/rate.css';
import ProductDetailPopup from './Extras/ProductDetailPopup';
import { backUrl } from "../Urls";

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
            setProducts(formattedProducts);
            setTotalPages(Math.ceil(formattedProducts.length / itemsPerPage)); // Calculate total pages
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

            <h1>Product Rate</h1>
            <table className="rate-table">
                <thead>
                <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Update Time</th>
                </tr>
                </thead>
                <tbody>
                {displayedProducts.map((product) => (
                    <tr key={product._id} onClick={() => handleRowClick(product)} style={{ cursor: 'pointer' }}>
                        <td>
                            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', marginLeft: '25%' }} />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.formattedUpdateTime}</td>
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
