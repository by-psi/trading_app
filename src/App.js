/**
 * App.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [price, setPrice] = useState(null);
	const BUY_PRICE = 60000; // Defina seu preço de compra

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const response = await axios.get("http://localhost:5000/price");
				setPrice(response.data.price);
			} catch (error) {
				console.error("Erro ao obter preço:", error);
			}
		};

		fetchPrice();
		const interval = setInterval(fetchPrice, 3000);
		return () => clearInterval(interval);
	}, []);

	const tradeDecision = () => {
		if (!price) return "Carregando...";
		if (price <= BUY_PRICE) return "Comprar BTC";
		if (price >= BUY_PRICE * 1.1) return "Vender BTC";
		return "Aguardando oportunidade...";
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>Bot de Monitoramento BTC</h1>
			<h2>Preço Atual: {price ? `$${price}` : "Carregando..."}</h2>
			<h3>Decisão: {tradeDecision()}</h3>
		</div>
	);
}

export default App;
*/
import { useState, useEffect } from 'react';

const BACKEND_URL = "http://localhost:3351";

function App() {
    const [monitoring, setMonitoring] = useState(false);
    const [btcPrice, setBtcPrice] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/btc-price`);
                const data = await res.json();
                setBtcPrice(data.price);
            } catch (error) {
                console.error("Erro ao buscar preço do BTC:", error);
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 5000);

        return () => clearInterval(interval);
    }, []);

    const startMonitoring = async () => {
        await fetch(`${BACKEND_URL}/start-monitoring`, { method: 'POST' });
        setMonitoring(true);
    };

    const stopMonitoring = async () => {
        await fetch(`${BACKEND_URL}/stop-monitoring`, { method: 'POST' });
        setMonitoring(false);
    };

    const sendAlerts = async () => {
        await fetch(`${BACKEND_URL}/send-alerts`, { method: 'POST' });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Bitcoin Monitor</h1>
            <h2>Preço Atual: {btcPrice ? `$${btcPrice}` : "Carregando..."}</h2>
            <button onClick={startMonitoring} disabled={monitoring}>Iniciar Monitoramento</button>
            <button onClick={stopMonitoring} disabled={!monitoring}>Parar Monitoramento</button>
            <button onClick={sendAlerts}>Enviar Alerta</button>
        </div>
    );
}

export default App;
