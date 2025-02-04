/**
/* App.js
*/

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [price, setPrice] = useState(null);
    const [averagePrice, setAveragePrice] = useState(null);

    const BACKEND_URL = "http://localhost:3351";

    useEffect(() => {
        const fetchPrices = async () => {
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

    const tradeDecision = () => {
        if (!price || !averagePrice) return "Carregando...";
        if (price <= averagePrice) return "Comprar BTC";
        if (price >= averagePrice * 1.1) return "Vender BTC";
        return "Aguardando oportunidade...";
    };

    const sendAlerts = async () => {
        await fetch(`${BACKEND_URL}/send-alerts`, { method: 'POST' });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>PSI-TRADING</h1>
            <h2>Bot de Monitoramento BTC</h2>
            <h2>Preço Atual: {price ? `$${price}` : "Carregando..."}</h2>
            <h2>Preço Médio 24h: {averagePrice ? `$${averagePrice}` : "Carregando..."}</h2>
            <h3>Decisão: {tradeDecision()}</h3>
            <button onClick={sendAlerts}>Enviar Alerta ao Grupo (Telegram)</button>
        </div>
    );
}

export default App;
