# N8N Nuxt Reddit Clone

A Reddit clone built with Nuxt.js and Appwrite backend.

## Features

- ✅ Appwrite SDK integration (client and server-side)
- ✅ Environment variable configuration
- ✅ Connection health monitoring
- ✅ Error handling and recovery
- 🚧 Authentication system (planned)
- 🚧 Post creation and management (planned)
- 🚧 Comment system (planned)
- 🚧 Real-time updates (planned)

## Quick Start

### Prerequisites
- Node.js 18+ 
- Appwrite account (Cloud or self-hosted)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Appwrite configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Appwrite Setup

1. Create an Appwrite project
2. Generate an API key with appropriate permissions
3. Update your `.env` file with the project details
4. Visit `/api/health` to check connection status

For detailed setup instructions, see [docs/APPWRITE_SETUP.md](docs/APPWRITE_SETUP.md)

## Project Structure

```
├── composables/          # Client-side Appwrite integration
├── server/
│   ├── api/              # API endpoints
│   └── utils/            # Server-side Appwrite utilities
├── plugins/              # Nuxt plugins for Appwrite
├── docs/                 # Documentation
└── .env.example          # Environment variables template
```

## Development

- **Health Check**: Visit `/api/health` to monitor Appwrite connection
- **Client Status**: Check the home page for real-time connection status
- **Documentation**: Comprehensive setup guide in `docs/APPWRITE_SETUP.md`

## Environment Variables

See `.env.example` for all required environment variables and their descriptions.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
