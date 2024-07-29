import React, { useState, useEffect } from 'react';
import '../css/rate.css';
import ProductDetailPopup from './Extras/ProductDetailPopup';
import { backUrl } from "../Urls";
import { formatToNepaliDigits } from './Extras/utils';

const Rate = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);

    const categories = [
        { value: 'all', label: 'All' },
        { value: 'cigarette', label: '🚬 चुरोट' },
        { value: 'noodle', label: '🍜 चाउचाउ' },
        { value: 'beans', label: '🫘 गेडगुडी' },
        { value: 'grain', label: '🌾 चामल' },
        { value: 'soap', label: '🧼 साबुन' },
        { value: 'electronic', label: '🔌 इलेक्ट्रोनिक' },
        { value: 'drink', label: '💧 Drinks' },
        { value: 'sanity', label: '⚕️ Sanity' },
        { value: 'chocolate', label: '🍫 चकलेट' },
        { value: 'biscuit', label: '🍪 बिस्कुट' },
        { value: 'others', label: '🛒 अन्य' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backUrl}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();

            // Create a map to store the latest product for each name
            const productMap = new Map();
            data.forEach(product => {
                const existingProduct = productMap.get(product.name);
                if (!existingProduct || new Date(product.createdAt) > new Date(existingProduct.createdAt)) {
                    productMap.set(product.name, product);
                }
            });

            // Convert map values to an array and format createdAt
            const uniqueProducts = Array.from(productMap.values()).map(product => ({
                ...product,
                formattedUpdateTime: new Date(product.createdAt).toISOString().split('T')[0],
            }));

            // Filter products by selected category
            const filteredProducts = selectedCategory === 'all'
                ? uniqueProducts
                : uniqueProducts.filter(product => product.category === selectedCategory);

            // Sort products in descending order by creation date
            const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to the first page when changing the category
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

            {/* Category selection buttons */}
            <div className="category-select">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        className={selectedCategory === cat.value ? 'active' : ''}
                        onClick={() => handleCategoryChange(cat.value)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

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
