import React, { useContext, useState, useEffect } from 'react';
import '../css/order.css';
import { backUrl } from "../Urls";
import { AuthContext } from "./AuthContext";
import ProductForm from "../Pages/Extras/ProductForm";

const InputDetail = ({ addOrder }) => {
    const [customerName, setCustomerName] = useState('');
    const [productName, setProductName] = useState('');
    const [paidNumber, setPaidNumber] = useState('');
    const [status, setStatus] = useState('Active');
    const [message, setMessage] = useState(null);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        syncCachedData();

        window.addEventListener('online', syncCachedData);
        return () => {
            window.removeEventListener('online', syncCachedData);
        };
    }, []);

    const handleLogout = () => {
        logout(); // Clears isLoggedIn and expiry time
    };

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
            const response = await fetch(`${backUrl}/order/try`, {
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
                setStatus('Active');
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error adding detail, data saved locally' });
            saveToLocalCache(newOrder);
        }
    };

    const handleAdvanceClick = () => {
        setProductName('Advance');
    };

    const addProduct = async (newProduct) => {
        try {
            const response = await fetch(`${backUrl}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            // Optionally, fetch products again to update the list with the newly added product
            // fetchProducts();

        } catch (error) {
            console.error('Error adding product:', error);
            // Handle error as needed (e.g., show error message)
        }
    };

    const saveToLocalCache = (order) => {
        const cachedOrders = JSON.parse(localStorage.getItem('cachedOrders')) || [];
        cachedOrders.push(order);
        localStorage.setItem('cachedOrders', JSON.stringify(cachedOrders));
    };

    const syncCachedData = async () => {
        const cachedOrders = JSON.parse(localStorage.getItem('cachedOrders')) || [];
        if (cachedOrders.length === 0) return;

        for (const order of cachedOrders) {
            try {
                const response = await fetch(`${backUrl}/order/try`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order),
                });

                if (!response.ok) {
                    throw new Error('Failed to sync order');
                }
            } catch (error) {
                console.error('Error syncing order:', error);
                return;
            }
        }

        localStorage.removeItem('cachedOrders');
        setMessage({ type: 'success', text: 'Cached data synced successfully' });
    };
 const closeMessage = () => {
        setMessage(null);
    };

    return (
       <div className="form-container">
            <h2>ADD DETAILS</h2>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                    <a className="close-button" onClick={closeMessage}>✖</a>
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
                <button type="submit">Add Detail</button>
                <br/>
            </form>
            <div>
            </div>
            <ProductForm onSubmit={addProduct} />
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default InputDetail;
