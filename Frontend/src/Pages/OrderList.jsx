import React, { useState, useEffect } from 'react';
import '../css/order.css';


const defaultAvatar = '/assets/default-avatar.jpg';

const OrderList = ({ orders }) => {
    const [visibleOrders, setVisibleOrders] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        setVisibleOrders(orders.slice(0, 3));
    }, [orders]);

    const handleShowAll = () => {
        setVisibleOrders(orders);
        setShowAll(true);
    };

    const handleHide = () => {
        setVisibleOrders(orders.slice(0, 3));
        setShowAll(false);
    };

    const handleDetails = (customerName) => {
        setSelectedCustomer(selectedCustomer === customerName ? null : customerName);
    };

    const selectedOrders = orders.filter(order => order.customerName === selectedCustomer);

    const calculateTotals = (orders) => {
        let totalPaid = 0;
        let totalToBePaid = 0;
        let advancePaid = 0;

        orders.forEach(order => {
            const paidAmount = parseFloat(order.paidNumber);
            if (order.productName === 'Advance') {
                advancePaid += paidAmount;
            }
            if (paidAmount >= 0) {
                totalPaid += paidAmount;
            } else {
                totalToBePaid += Math.abs(paidAmount);
            }
        });

        return { totalPaid, totalToBePaid, advancePaid };
    };

    const totals = calculateTotals(selectedOrders);

    const getAvatarUrl = (customerName) => {
        const avatarBasePath = `/assets/avatars/`;
        const avatarFileName = `${customerName.toLowerCase().replace(/ /g, '-')}.jpg`;
        return `${avatarBasePath}${avatarFileName}`;
    };

    const Avatar = ({ customerName }) => {
        const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);

        useEffect(() => {
            const avatarUrl = getAvatarUrl(customerName);
            const img = new Image();
            img.src = avatarUrl;
            img.onload = () => setAvatarSrc(avatarUrl);
            img.onerror = () => setAvatarSrc(defaultAvatar);
        }, [customerName]);

        return <img src={avatarSrc} alt={customerName} className="avatar" />;
    };

    return (
        <div>
            <div className="recent-orders">
                <h1>Recent Details</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Customer Name</th>
                        <th>Paid Amount</th>
                        <th>Product Name</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {visibleOrders.map((order, index) => (
                        <tr key={index}>
                            <td>
                                <Avatar customerName={order.customerName}/>
                            </td>
                            <td>{order.customerName}</td>
                            <td>{order.paidNumber}</td>
                            <td>{order.productName}</td>
                            <td className={order.paymentStatus === 'Paid' ? 'primary' : 'secondary'}>
                                {order.paymentStatus}
                            </td>
                            <td className={order.status === 'Pending' ? 'warning' : 'primary'}>
                                {order.status}
                            </td>
                            <td>{new Date(order.date).toISOString().slice(0, 10).replace('T', ' ')}</td>
                            <td><a className="detail" onClick={() => handleDetails(order.customerName)}>Details</a></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {!showAll ? (
                    <a className="cur" onClick={handleShowAll}>Show All</a>
                ) : (
                    <a className="cur1" onClick={handleHide}>Hide</a>
                )}
            </div>
            {selectedCustomer && (
                <div className="customer-details-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="customer-details" onClick={e => e.stopPropagation()}>
                        <div className="customer-header">
                            <h2 className="customer-name"> <Avatar customerName={selectedCustomer}/>{selectedCustomer}   </h2>
                        </div>
                        <ul>
                            {selectedOrders.map((order, index) => (
                                <li key={index}>
                                    <strong>Date:</strong> {new Date(order.date).toISOString().slice(0, 19).replace('T', ' ')} <br />
                                    <strong>Product Name:</strong> {order.productName} <br />
                                    <strong>Paid Amount:</strong> {order.paidNumber} <br />
                                    <strong>Status:</strong> {order.status}
                                </li>
                            ))}
                        </ul>
                        <div className="totals">
                            <p><strong>Total Amount Paid:</strong> {totals.totalPaid}</p>
                            <p><strong>Total Amount Left to Pay:</strong> {totals.totalToBePaid}</p>
                            {totals.advancePaid !== 0 && (
                                <p><strong>Total Advance Paid:</strong> {totals.advancePaid}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
