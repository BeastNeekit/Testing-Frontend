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
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [oldestChanges, setOldestChanges] = useState([]);

    const itemsPerPage = 24;

    const categories = [
        { value: 'all', label: 'All', icon: '=' },
        { value: 'cigarette', label: '🚬 चुरोट', icon: '🚬' },
        { value: 'noodle', label: '🍜 चाउचाउ', icon: '🍜' },
        { value: 'beans', label: '🫘 गेडगुडी', icon: '🫘' },
        { value: 'grain', label: '🌾 चामल', icon: '🌾' },
        { value: 'soap', label: '🧼 साबुन', icon: '🧼' },
        { value: 'electronic', label: '🔌 इलेक्ट्रोनिक', icon: '🔌' },
        { value: 'drink', label: '💧 Drinks', icon: '💧' },
        { value: 'sanity', label: '⚕️ Sanity', icon: '⚕️' },
        { value: 'chocolate', label: '🍫 चकलेट', icon: '🍫' },
        { value: 'biscuit', label: '🍪 बिस्कुट', icon: '🍪' },
        { value: 'others', label: '🛒 अन्य', icon: '🛒' },
    ];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backUrl}/products`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const uniqueProducts = getUniqueProducts(data);
            const filteredProducts = filterProductsByCategory(uniqueProducts);
            const sortedProducts = sortProductsByDate(filteredProducts);
            const changes = calculateRateChanges(data);

            setProducts(sortedProducts);
            setTotalPages(calculateTotalPages(sortedProducts.length, itemsPerPage));

            // Get the oldest 4 changes
            const oldestFourChanges = changes.length > 0 ? changes.slice(-4) : [];
            setOldestChanges(oldestFourChanges);

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    const getUniqueProducts = (products) => {
        const productMap = new Map();
        products.forEach(product => {
            const existingProduct = productMap.get(product.name);
            if (!existingProduct || new Date(product.createdAt) > new Date(existingProduct.createdAt)) {
                productMap.set(product.name, product);
            }
        });
        return Array.from(productMap.values()).map(product => ({
            ...product,
            formattedUpdateTime: new Date(product.createdAt).toISOString().split('T')[0],
        }));
    };

    const filterProductsByCategory = (products) => {
        return selectedCategory === 'all'
            ? products
            : products.filter(product => product.category === selectedCategory);
    };

    const sortProductsByDate = (products) => {
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const calculateTotalPages = (totalItems, itemsPerPage) => {
        return Math.ceil(totalItems / itemsPerPage);
    };

    const calculateRateChanges = (products) => {
        const changes = [];
        const productMap = new Map();

        products.forEach(product => {
            const existingProduct = productMap.get(product.name);
            if (existingProduct) {
                const priceChange = product.price - existingProduct.price;
                if (priceChange !== 0) {
                    changes.push({
                        name: product.name,
                        priceChange,
                        date: new Date(product.createdAt).toISOString().split('T')[0],
                        isIncrease: priceChange > 0,
                    });
                }
            }
            productMap.set(product.name, product);
        });

        // Sort changes by date to find the oldest
        changes.sort((a, b) => new Date(a.date) - new Date(b.date));
        return changes;
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
        <div className="rate-container">
            <div className="sidebar">
                <div className="category-list">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            className={selectedCategory === cat.value ? 'active' : ''}
                            onClick={() => handleCategoryChange(cat.value)}
                            aria-label={cat.label}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>


            <div className="product-section">
                <marquee direction="right" loop="">
                <div className="oldest-changes">
                    {oldestChanges.length > 0 ? (
                        <div className="oldest-changes-list">
                            {oldestChanges.map((change, index) => (
                                <div
                                    key={index}
                                    className={`change-item ${change.isIncrease ? 'increase' : 'decrease'}`}
                                >
                                    <span className="product-name">{change.name}</span>
                                    <span className="price-change">
                                     {change.isIncrease ? '🚀' : '🔻'}रु {formatToNepaliDigits(Math.abs(change.priceChange).toString())}
                                    </span>
                                    <span className="change-date">{formatToNepaliDigits(change.date.toString())}</span>
                                </div>
                            ))}
                        </div>

                    ) : (
                        <div className="no-changes-message">No changes available</div>
                    )}
                </div>
                </marquee>
                {loading && <div className="loading-message">Loading...</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="category-list2">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            className={selectedCategory === cat.value ? 'active' : ''}
                            onClick={() => handleCategoryChange(cat.value)}
                            aria-label={cat.label}
                        >
                            {cat.icon}
                        </button>
                    ))}
                </div>
                {displayedProducts.length > 0 ? (
                    <div className="product-grid">
                        {displayedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="product-card"
                                onClick={() => handleRowClick(product)}
                            >
                                <img src={product.image} alt={product.name} className="product-image"/>
                                <div className="product-info">
                                    <h4 className="product-name">{product.name}</h4>
                                    <p className="product-price">रु {formatToNepaliDigits(product.price.toString())}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-products-message">
                        Items are not registered !!
                    </div>
                )}

                {renderPagination()}

                {selectedProduct && <ProductDetailPopup product={selectedProduct} onClose={closeModal}/>}
            </div>
        </div>
    );
};

export default Rate;
