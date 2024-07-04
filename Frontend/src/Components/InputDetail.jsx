
import React, { useState } from 'react';
import '../css/order.css';
import {backUrl} from "../Urls";
import OrderList from "../Pages/OrderList";

const InputDetail = ({ addOrder }) => {
    const [customerName, setCustomerName] = useState('');
    const [productName, setProductName] = useState('');
    const [paidNumber, setPaidNumber] = useState('');
    const [status, setStatus] = useState('Active');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const paymentStatus = parseFloat(paidNumber) >= 0 ? 'Paid' : 'Due';
        const now = new Date();
        const nepalTime = now.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
        const uniqueId = Date.now().toString();

        const newOrder = {
            id: uniqueId,
            customerName,
            productName,
            paidNumber,
            paymentStatus,
            status,
            date: nepalTime,
        };

        try {
            const response = await fetch(`${backUrl}/oder/try`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            const result = await response.json();
            if (response.ok) {
                addOrder(result.order);
                setMessage({ type: 'success', text: result.message });
                // Clear the form
                setCustomerName('');
                setProductName('');
                setPaidNumber('');
                setStatus('Pending');
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error adding order' });
        }
    };

    const handleAdvanceClick = () => {
        setProductName('Advance');
    };

    return (
        <div className="form-container">
            <h2>ADD DETAILS</h2>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <div className="product-name-container">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    <a className="set-advance-link" onClick={handleAdvanceClick}>Set to Advance</a>
                </div>
                <input
                    type="text"
                    placeholder="Paid Amount"
                    value={paidNumber}
                    onChange={(e) => setPaidNumber(e.target.value)}
                />
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="Pending"
                            checked={status === 'Pending'}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        Pending
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Active"
                            checked={status === 'Active'}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                        Active
                    </label>
                </div>
                <button type="submit">Add Order</button>
            </form>
             <OrderList/>
        </div>
    );
};

export default InputDetail;
