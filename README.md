# n8n-nuxt-reddit-clone

A modern Reddit clone built with cutting-edge web technologies.

## Tech Stack

- **Nuxt 4** - Full-stack Vue framework with the latest features
- **Tailwind CSS v4** - Utility-first CSS framework (integrated via @nuxt/ui)
- **Nuxt UI** - Beautiful & fully featured UI library built on top of Tailwind CSS & Headless UI
- **Reka UI** - Vue port for Radix UI Primitives for accessibility
- **TypeScript** - Type-safe development
- **Pinia** - Intuitive state management for Vue

## Features

✅ **Nuxt 4** - Latest version with enhanced performance and DX
✅ **Tailwind CSS v4** - Modern utility-first styling via @nuxt/ui
✅ **Nuxt UI** - Professional UI components with built-in accessibility
✅ **Reka UI** - Accessibility-first headless components
✅ **TypeScript** - Full type safety across the application
✅ **Pinia** - Reactive state management
✅ **Dev Server** - Hot reload development environment

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

### Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Project Structure

```
├── app/
│   └── app.vue          # Main application component
├── components/          # Vue components
├── assets/
│   └── css/
│       └── main.css     # Tailwind CSS imports
├── stores/              # Pinia stores
├── plugins/             # Nuxt plugins
├── nuxt.config.ts       # Nuxt configuration
└── package.json         # Dependencies and scripts
```

## Configuration

### Nuxt Configuration (`nuxt.config.ts`)
- **@nuxt/ui** - Provides Tailwind CSS v4 and UI components
- **@pinia/nuxt** - Pinia integration for state management

### Dependencies
- `nuxt`: ^4.0.1
- `@nuxt/ui`: ^3.3.0 (includes Tailwind CSS v4)
- `@pinia/nuxt`: ^0.11.2
- `pinia`: ^3.0.3
- `reka-ui`: ^2.4.1

## License

MIT
