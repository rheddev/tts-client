import { startTTSServer } from './server';

const server = startTTSServer();
console.log('TTS WebSocket server running on port 8080');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down TTS server...');
  server.close(() => {
    console.log('TTS server closed');
    process.exit(0);
  });
}); 