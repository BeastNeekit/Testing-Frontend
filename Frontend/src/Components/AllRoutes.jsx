import React, { useContext, useEffect, useState } from "react";
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from '../Pages/Login';
import Rate from '../Pages/Rate';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Add from "./InputDetail";
import { backUrl } from '../Urls';
import { AuthContext } from './AuthContext';

const AllRoutes = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        } else {
            setOrders([]); // Clear orders if not logged in
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${backUrl}/oder/try`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError('Expected JSON response from server');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching Details:', error);
        }
    };

    const addOrder = (newOrder) => {
        setOrders([...orders, { ...newOrder, id: (orders.length + 1).toString() }]);
    };

    return (
        <div>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/rate' element={<Rate />} />
                <Route path='/' element={<Home />} />

                {isLoggedIn ? (
                    <>
                        <Route path='/statement' element={<About orders={orders} />} />
                        <Route path='/add' element={<Add addOrder={addOrder} />} />
                    </>
                ) : (
                    <Route path='*' element={<Navigate to='/login' replace />} />
                )}
            </Routes>
        </div>
    );
}

export default AllRoutes;
