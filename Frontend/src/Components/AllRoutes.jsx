import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Statement from "../Pages/Statement";
import Add from "./InputDetail";
import { backUrl } from '../Urls';

const AllRoutes = () => {
    const [orders, setOrders] = useState([]);

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
                <Route path='/signup' element={<SignUp />} />
                <Route path='/' element={<Home />} />
                <Route path='/statement' element={<About orders={orders} />} />
                <Route path='/add' element={<Add addOrder={addOrder} />} />
                {/* Private Routes */}
            </Routes>
        </div>
    );
}

export default AllRoutes;
