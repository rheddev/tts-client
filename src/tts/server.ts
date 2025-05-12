import { WebSocketServer, WebSocket } from 'ws';

export const startTTSServer = () => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error('Error handling TTS message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}; 