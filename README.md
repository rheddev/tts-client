# TTS Client

A modern web client for the Text-to-Speech broadcasting system, built with Vue.js and TypeScript.

## Features

- Real-time WebSocket communication
- Modern, responsive UI
- TypeScript support
- Vite-based development environment
- ESLint configuration for code quality

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rheddev/tts-client.git
cd tts-client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The development server will start at `http://localhost:5173` by default.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
tts-client/
├── src/              # Source files
├── public/           # Static assets
├── index.html        # Entry HTML file
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies and scripts
```

## Configuration

The client can be configured through environment variables. Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## License

[Your License Here]
