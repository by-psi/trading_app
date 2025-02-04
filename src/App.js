/**
/* App.js
*/

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [price, setPrice] = useState(null);
    const [averagePrice, setAveragePrice] = useState(null);
    const [highestPrice, setHighestPrice] = useState(null);
    const [lowestPrice, setLowestPrice] = useState(null);
    const [recommendation, setRecommendation] = useState("Carregando...");

    const BACKEND_URL = "http://localhost:3351";

    useEffect(() => {
        async function fetchPrices() {
            try {
                const btcResponse = await axios.get(`${BACKEND_URL}/btc-price`);
                const avgResponse = await axios.get(`${BACKEND_URL}/btc-average-price`);
                setPrice(btcResponse.data.price);
                setAveragePrice(avgResponse.data.avgPrice);
            } catch (error) {
                console.error("Erro ao obter preços:", error);
            }
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchRecommendation() {
            try {
                const response = await axios.get(`${BACKEND_URL}/trade-recommendation`);
                setPrice(response.data.price);
                setHighestPrice(response.data.highestPrice);
                setLowestPrice(response.data.lowestPrice);
                setRecommendation(response.data.recommendation);
            } catch (error) {
                console.error("Erro ao obter recomendação:", error);
            }
        };

        fetchRecommendation();
        const interval = setInterval(fetchRecommendation, 3000);
        return () => clearInterval(interval);
    }, []);

    function tradeDecision() {
        if (!price || !averagePrice) return "Carregando...";
        if (price <= averagePrice) return "Comprar BTC";
        if (price >= averagePrice * 1.1) return "Vender BTC";
        return "Aguardando oportunidade...";
    };

    async function sendAlerts() {
        await axios.post(`${BACKEND_URL}/send-alerts`, { method: 'POST' });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>PSI-TRADING</h1>
            <h2>Bot de Monitoramento BTC</h2>
            <h2>Preço Atual: {price ? `$${price}` : "Carregando..."}</h2>
            <h2>Preço Médio (últimas 24h): {averagePrice ? `$${averagePrice}` : "Carregando..."}</h2>
            <h3>Decisão: {tradeDecision()}</h3>

            <h2>Maior Preço (últimas 24h): {highestPrice ? `$${highestPrice}` : "Carregando..."}</h2>
            <h2>Menor Preço (últimas 24h): {lowestPrice ? `$${lowestPrice}` : "Carregando..."}</h2>
            <h3>{recommendation}</h3>
            <br />
            <button onClick={sendAlerts}>Enviar Alerta ao Grupo (Telegram)</button>
        </div>
    );
}

export default App;
