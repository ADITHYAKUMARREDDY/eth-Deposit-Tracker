// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
    const [deposits, setDeposits] = useState([]);

    // Fetch deposit data from the backend
    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/deposits');
            setDeposits(response.data);
        } catch (error) {
            console.error('Error fetching deposits:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Ethereum Deposit Tracker</h1>
                <h2>Deposits</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Block Number</th>
                            <th>Transaction Hash</th>
                            <th>Fee</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.map((deposit) => (
                            <tr key={deposit.hash}>
                                <td>{deposit.blockNumber}</td>
                                <td>{deposit.hash}</td>
                                <td>{deposit.fee}</td>
                                <td>{new Date(deposit.blockTimestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </header>
        </div>
    );
}

export default App;
