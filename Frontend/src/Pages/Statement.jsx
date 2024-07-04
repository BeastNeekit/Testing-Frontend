import React, { useState, useEffect } from 'react';
import '../css/statement.css';

const Statement = ({ orders }) => {
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [status, setStatus] = useState('All Status');
    const [product, setProduct] = useState('Select All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredOrders(orders || []);
    }, [orders]);

    const filterOrders = (status, product, search) => {
        let filtered = orders || [];

        if (status !== 'All Status') {
            filtered = filtered.filter(order => order.paymentStatus === status);
        }

        if (product !== 'Select All') {
            filtered = filtered.filter(order => order.productName === product);
        }

        if (search) {
            filtered = filtered.filter(order => order.customerName.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredOrders(filtered);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        filterOrders(newStatus, product, search);
    };

    const handleProductChange = (e) => {
        const newProduct = e.target.value;
        setProduct(newProduct);
        filterOrders(status, newProduct, search);
    };

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        filterOrders(status, product, newSearch);
    };

    const handleRefresh = () => {
        setStatus('All Status');
        setProduct('Select All');
        setSearch('');
        setFilteredOrders(orders || []);
    };

    return (
        <div className="statement-container">
            <div className="header">
                <h2>STATEMENT <a className="refresh-icon" onClick={handleRefresh}>⟲</a></h2>
            </div>
            <div className="filters">
                <select className="dropdown status-dropdown" value={status} onChange={handleStatusChange}>
                    <option>All Status</option>
                    <option>Paid</option>
                    <option>Due</option>
                </select>
                <select className="dropdown product-dropdown" value={product} onChange={handleProductChange}>
                    <option>Select All</option>
                    <option>Advance</option>
                </select>
                <input type="text" className="search" placeholder="Search by Name" value={search} onChange={handleSearchChange} />
                <button className="search-btn">&#x1F50E;</button>
            </div>
            {filteredOrders && filteredOrders.length > 0 ? (
                <div className="filtered-orders">
                    <table>
                        <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Status</th>
                            <th>Paid Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.customerName}</td>
                                <td>{order.paymentStatus}</td>
                                <td>{order.paidNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Statement;