import React, { useEffect, useState } from 'react';
import '../css/dashboard.css';
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart} from 'recharts';
import { backUrl } from "../Urls";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [averageIncome, setAverageIncome] = useState(0);
    const [highestIncome, setHighestIncome] = useState({ amount: 0, date: '' });
    const [chartData, setChartData] = useState([]);
    const [savingData, setSavingData] = useState([]);
    const [investData, setInvestData] = useState([]); // State for invest data
    const [showSavingGraph, setShowSavingGraph] = useState(false);
    const [showInvestGraph, setShowInvestGraph] = useState(false); // State for visibility of Invest graph

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${backUrl}/oder/try`);
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
        const savingGraphData = {};
        const investGraphData = {}; // New object for invest graph data
        let total = 0;
        let minDate = null;
        let maxDate = null;
        let highest = { amount: 0, date: '' };

        orders.forEach(order => {
            const date = new Date(order.date);
            date.setUTCHours(0, 0, 0, 0); // Set UTC hours to 0 to standardize for UTC timezone
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // dd/mm/yyyy format
            const earnings = parseFloat(order.paidNumber);

            if (order.productName === "Saving" && order.paymentStatus === "Due") {
                const positiveEarnings = Math.abs(earnings); // Convert to positive value
                if (savingGraphData[formattedDate]) {
                    savingGraphData[formattedDate] += positiveEarnings;
                } else {
                    savingGraphData[formattedDate] = positiveEarnings;
                }
            } else if (order.productName === "Less" && order.paymentStatus === "Due") {
                const positiveEarnings = Math.abs(earnings); // Convert to positive value
                if (investGraphData[formattedDate]) {
                    investGraphData[formattedDate] += positiveEarnings;
                } else {
                    investGraphData[formattedDate] = positiveEarnings;
                }
            } else {
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
            }
        });

        setTotalIncome(total);

        if (minDate && maxDate) {
            const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24) + 1);
            setAverageIncome(total / totalDays);
        }

        setHighestIncome(highest);

        // Prepare chart data for each day
        const chartDataArray = [];
        const savingDataArray = [];
        const investDataArray = []; // New array for invest data

        let currentDate = new Date(minDate);

        while (currentDate <= maxDate) {
            currentDate.setUTCHours(0, 0, 0, 0); // Set UTC hours to 0 to standardize for UTC timezone
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            const earningsForDate = incomeData[formattedDate] || 0;
            const highestEarningsForDate = highestEarningsData[formattedDate] || 0;
            const dueAmountForDate = dueAmountData[formattedDate] || 0;
            const savingAmountForDate = savingGraphData[formattedDate] || 0;
            const investAmountForDate = investGraphData[formattedDate] || 0; // Get invest data for the date

            chartDataArray.push({
                date: formattedDate,
                earnings: earningsForDate,
                highestEarnings: highestEarningsForDate,
                dueAmount: dueAmountForDate,
            });

            savingDataArray.push({
                date: formattedDate,
                saving: savingAmountForDate,
            });

            investDataArray.push({
                date: formattedDate,
                invest: investAmountForDate,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        setChartData(chartDataArray);
        setSavingData(savingDataArray);
        setInvestData(investDataArray); // Set invest data
    };

    const toggleSavingGraph = () => {
        setShowSavingGraph(!showSavingGraph);
    };

    const toggleInvestGraph = () => {
        setShowInvestGraph(!showInvestGraph);
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
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `${value}`} />
                        <Tooltip formatter={(value) => `Rs.${value}`} />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            type="monotone"
                            dataKey="earnings"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="highestEarnings"
                            stroke="gold"
                            fill="yellow"
                            fillOpacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="dueAmount"
                            stroke="#ff474c"
                            fill="#ff474c"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <button onClick={toggleSavingGraph}>
                    {showSavingGraph ? 'Hide Saving Graph' : 'Show Saving Graph'}
                </button>
                {showSavingGraph && (
                    <>
                        <h3>SAVING GRAPH</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={savingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `${value}`} />
                                <Tooltip formatter={(value) => `Rs.${value}`} />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="saving"
                                    stroke="green"
                                    fill="lime"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </>
                )}
                <button onClick={toggleInvestGraph}>
                    {showInvestGraph ? 'Hide Invest Graph' : 'Show Invest Graph'}
                </button>
                {showInvestGraph && (
                    <>
                        <h3>INVEST GRAPH</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={investData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `${value}`} />
                                <Tooltip formatter={(value) => `Rs.${value}`} />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="invest"
                                    stroke="#0000ff"
                                    fill="#00bfff"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
