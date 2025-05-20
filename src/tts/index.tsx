import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { Queue } from "./Queue";

interface Message {
  name: string;
  amount: number;
  message: string;
}

export const TTSServer: React.FC = () => {
  const [messageQueue] = useState(() => new Queue<Message>());
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [displayMessage, setDisplayMessage] = useState<Message | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakMessage = useCallback((message: Message) => {
    const text = `${message.name} donated ${message.amount} dollars and said: ${message.message}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setDisplayMessage(message);
      setIsSpeaking(true);
      console.log('Started speaking:', text);
    };
    
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setDisplayMessage(null);
      setIsSpeaking(false);
      messageQueue.dequeue(); // Remove the message after speaking
      console.log('Finished speaking:', text);
    };
  }, [messageQueue]);

  const processQueue = useCallback(() => {
    if (!isSpeaking && !messageQueue.isEmpty()) {
      const nextMessage = messageQueue.peek();
      if (nextMessage) {
        speakMessage(nextMessage);
      }
    }
  }, [isSpeaking, messageQueue, speakMessage]);

  // Monitor queue and process messages
  useEffect(() => {
    const interval = setInterval(processQueue, 100);
    return () => clearInterval(interval);
  }, [processQueue]);

  const initializeConnection = useCallback(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const ws = new WebSocket("ws://localhost:8080/ws/listen");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setWsConnected(true);
      const welcomeMessage: Message = {
        name: "System",
        amount: 0,
        message: "Connected to TTS server"
      };
      messageQueue.enqueue(welcomeMessage);
    };

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        messageQueue.enqueue(message);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setWsConnected(false);
      const disconnectMessage: Message = {
        name: "System",
        amount: 0,
        message: "Disconnected from TTS server"
      };
      messageQueue.enqueue(disconnectMessage);
    };

    return () => {
      ws.close();
      window.speechSynthesis.cancel();
    };
  }, [isInitialized, messageQueue]);

  return (
    <div className="messages-container">
      {!isInitialized ? (
        <button className="start-button" onClick={initializeConnection}>
          Start TTS
        </button>
      ) : (
        <>
          <div className="connection-status">
            WebSocket Status: {wsConnected ? "Connected" : "Disconnected"}
          </div>

          {error && <div className="error-message">{error}</div>}

          {displayMessage && (
            <div className="messages-list">
              <div className="message-item">
                <pre>{JSON.stringify(displayMessage, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TTSServer;
