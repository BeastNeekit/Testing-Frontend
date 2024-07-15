import React, { useState, useEffect } from 'react';
import '../css/statement.css';

const Statement = ({ orders }) => {
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState([]);
    const [status, setStatus] = useState('All Status');
    const [product, setProduct] = useState('Select All');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        setFilteredOrders(orders || []);
    }, [orders]);

    useEffect(() => {
        setVisibleOrders(filteredOrders.slice(0, showAll ? filteredOrders.length : 5));
    }, [filteredOrders, showAll]);

    const filterOrders = (status, product, search, startDate, endDate) => {
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

        if (startDate) {
            filtered = filtered.filter(order => new Date(order.date) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(order => new Date(order.date) <= new Date(endDate));
        }

        setFilteredOrders(filtered);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        filterOrders(newStatus, product, search, startDate, endDate);
    };

    const handleProductChange = (e) => {
        const newProduct = e.target.value;
        setProduct(newProduct);
        filterOrders(status, newProduct, search, startDate, endDate);
    };

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        filterOrders(status, product, newSearch, startDate, endDate);
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        filterOrders(status, product, search, newStartDate, endDate);
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        filterOrders(status, product, search, startDate, newEndDate);
    };

    const handleRefresh = () => {
        setStatus('All Status');
        setProduct('Select All');
        setSearch('');
        setStartDate('');
        setEndDate('');
        setFilteredOrders(orders || []);
    };

    const handleShowMore = () => setShowAll(true);
    const handleShowLess = () => setShowAll(false);

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
                <input type="date" className="date-picker" value={startDate} onChange={handleStartDateChange} />
                <input type="date" className="date-picker" value={endDate} onChange={handleEndDateChange} />
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
                        {visibleOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.customerName}</td>
                                <td>{order.paymentStatus}</td>
                                <td>{order.paidNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {filteredOrders.length > 5 && (
                        <div className="show-more-less">
                            {!showAll ? (
                                <button className="show-more" onClick={handleShowMore}>Show More</button>
                            ) : (
                                <button className="show-less" onClick={handleShowLess}>Show Less</button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Statement;
