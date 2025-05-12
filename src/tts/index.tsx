import { useEffect, useState } from 'react';
import './index.css';

interface TTSMessage {
    name: string;
    amount: number;
    message: string;
    id: number;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

async function streamAudio(text: string) {
    try {
        const response = await fetch('https://play.ht/api/v2/tts/stream', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_PLAYHT_API_KEY}`,
                'X-User-ID': import.meta.env.VITE_PLAYHT_USER_ID,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voice: 'en-US-JennyNeural',
                output_format: 'mp3',
                quality: 'high',
                speed: 1,
                sample_rate: 24000,
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    } catch (error) {
        console.error('Error streaming audio:', error);
    }
}

export const TTSServer = () => {
    const [messages, setMessages] = useState<TTSMessage[]>([]);
    const [fadingOut, setFadingOut] = useState<number[]>([]);

    useEffect(() => {
        console.log('Attempting to connect to WebSocket server...');
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Successfully connected to WebSocket server');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onmessage = async (event) => {
            try {
                const message: TTSMessage = {
                    ...JSON.parse(event.data),
                    id: Date.now()
                };
                setMessages((prev) => [...prev, message]);

                // Stream and play the TTS audio
                await streamAudio(message.message);

                setTimeout(() => {
                    setFadingOut((prev) => [...prev, message.id]);
                }, 4500);

                setTimeout(() => {
                    setMessages((prev) => prev.filter((m) => m.id !== message.id));
                    setFadingOut((prev) => prev.filter((id) => id !== message.id));
                }, 5000);
            } catch (error) {
                console.error('Error parsing TTS message:', error);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="tts-container">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`tts-message ${fadingOut.includes(msg.id) ? 'fade-out' : ''}`}
                >
                    <div className="tts-name">
                        {msg.name} <span className="tts-amount">donated {formatAmount(msg.amount)}</span>
                    </div>
                    <div className="tts-text">{msg.message}</div>
                </div>
            ))}
        </div>
    );
};

export default TTSServer;
