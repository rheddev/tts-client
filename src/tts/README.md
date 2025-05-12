# Text-to-Speech (TTS) System

This system handles incoming text-to-speech donations through WebSocket connections.

## Structure

The TTS system consists of two main components:

1. **WebSocket Server** (`src/tts/index.tsx`)
   - Listens for incoming TTS messages on port 8080
   - Handles message display and cleanup
   - Manages WebSocket connections

2. **Message Display**
   - Shows messages in the bottom-right corner of the screen
   - Automatically removes messages after 5 seconds
   - Displays donor name, amount, and message

## Message Format

Incoming WebSocket messages should be JSON objects with the following structure:

```typescript
interface TTSMessage {
  name: string;    // Donor's name
  amount: number;  // Donation amount in USD
  message: string; // The message to be displayed
}
```

Example message:
```json
{
  "name": "John Doe",
  "amount": 10.50,
  "message": "Thanks for the great stream!"
}
```

## Usage

1. Start the TTS server by importing and using the `TTSServer` component in your application
2. Connect to the WebSocket server at `ws://localhost:8080`
3. Send messages in the specified JSON format
4. Messages will automatically appear and disappear after 5 seconds

## Client Implementation

To send messages from another website or application, you can use the WebSocket client. Here's an example of how to implement it in a Next.js application:

```typescript
// Example client implementation
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected to TTS server');
};

// Send a message
const message = {
  name: 'Donor Name',
  amount: 10.50,
  message: 'Your message here'
};

socket.send(JSON.stringify(message));
```

A complete client component example is available in `src/tts/client-example.tsx`. This component includes:
- Connection status management
- Error handling
- A test button to send messages
- Proper cleanup on unmount

## Styling

Messages are displayed with a semi-transparent black background and white text. They appear in the bottom-right corner of the screen with a fade-in animation.

## Dependencies

- `ws`: WebSocket server implementation
- React for UI components
- Tailwind CSS for styling