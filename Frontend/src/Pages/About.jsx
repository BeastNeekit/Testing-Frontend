
import React, {useEffect, useState} from "react";
import OrderList from "./OrderList";
import Statement from "./Statement";
import {backUrl} from "../Urls";

const About = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${backUrl}/try`);
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
            console.error('Error fetching orders:', error);
        }
    };

    const addOrder = (newOrder) => {
        setOrders([...orders, { ...newOrder, id: (orders.length + 1).toString() }]);
    };
  return (
    <div>
        <Statement orders={orders}/>
        <OrderList orders={orders}/>

    </div>
  );
};

export default About;
