import React, { useEffect, useState } from 'react';
import '../css/dashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { backUrl } from "../Urls";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [averageIncome, setAverageIncome] = useState(0);
    const [highestIncome, setHighestIncome] = useState({ amount: 0, date: '' });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${backUrl}/order/try`);
                const data = await response.json();
                setOrders(data);
                processOrderData(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const processOrderData = (orders) => {
        const incomeData = {};
        const highestEarningsData = {};
        const dueAmountData = {};
        let total = 0;
        let minDate = null;
        let maxDate = null;
        let highest = { amount: 0, date: '' };

        orders.forEach(order => {
            const date = new Date(order.date);
            const formattedDate = date.toLocaleDateString('en-GB');
            const earnings = parseFloat(order.paidNumber);

            if (earnings !== 0) {
                if (earnings > 0) {
                    total += earnings;

                    if (incomeData[formattedDate]) {
                        incomeData[formattedDate] += earnings;
                    } else {
                        incomeData[formattedDate] = earnings;
                    }

                    if (!highestEarningsData[formattedDate] || earnings > highestEarningsData[formattedDate]) {
                        highestEarningsData[formattedDate] = earnings;
                    }

                    if (earnings > highest.amount) {
                        highest.amount = earnings;
                        highest.date = formattedDate;
                    }
                } else {
                    if (dueAmountData[formattedDate]) {
                        dueAmountData[formattedDate] += earnings;
                    } else {
                        dueAmountData[formattedDate] = earnings;
                    }
                }

                if (!minDate || date < minDate) {
                    minDate = date;
                }
                if (!maxDate || date > maxDate) {
                    maxDate = date;
                }
            }
        });
        console.log('Total earnings:', total);
        console.log('Income data:', incomeData);
        console.log('Highest earnings data:', highestEarningsData);
        console.log('Due amount data:', dueAmountData);
        
        setTotalIncome(total);

        if (minDate && maxDate) {
            const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
            setAverageIncome(total / totalDays);
        }

        setHighestIncome(highest);

        // Prepare chart data for each day
        const chartDataArray = [];
        let currentDate = minDate;

        while (currentDate <= maxDate) {
            const formattedDate = currentDate.toLocaleDateString('en-GB');
            const earningsForDate = incomeData[formattedDate] || 0;
            const highestEarningsForDate = highestEarningsData[formattedDate] || 0;
            const dueAmountForDate = dueAmountData[formattedDate] || 0;

            chartDataArray.push({
                date: formattedDate,
                earnings: earningsForDate,
                highestEarnings: highestEarningsForDate,
                dueAmount: dueAmountForDate,
            });

            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        console.log('Chart data:', chartDataArray);
        setChartData(chartDataArray);
    };


    return (
        <div className="dashboard-container">
            <div className="dashboard-cards">
                <div className="card tasks">
                    <h3>Total Income</h3>
                    <p>Rs.{totalIncome.toFixed(2)}</p>
                </div>
                <div className="card credits">
                    <h3>Average Income</h3>
                    <p>Rs.{averageIncome.toFixed(2)}</p>
                </div>
                <div className="card affiliates">
                    <h3>Highest Income</h3>
                    <p>{`Rs.${highestIncome.amount.toFixed(2)} on ${highestIncome.date}`}</p>
                </div>
            </div>
            <div className="chart-container">
                <h3>INCOME GRAPH</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${value}`} />
                        <Tooltip formatter={(value) => `Rs.${value}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="monotone"
                            dataKey="earnings"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 5, strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="highestEarnings"
                            stroke="#ff474c"
                            strokeWidth={2}
                            dot={{ r: 5, strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="dueAmount"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ r: 5, strokeWidth: 2 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
