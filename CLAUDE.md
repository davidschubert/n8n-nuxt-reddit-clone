# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Reddit-like application built with Nuxt 4, designed to demonstrate modern full-stack web development practices. The project uses a minimal starter configuration and is intended to be expanded with features like authentication, post creation, commenting, and voting systems.

## Technology Stack

- **Framework**: Nuxt 4 (v4.0.1) with TypeScript
- **Frontend**: Vue 3 (v3.5.18) with Composition API (`<script setup>`)
- **State Management**: Pinia (planned) with Pinia Plugin Persistedstate and Pinia Colada
- **Backend**: Appwrite Server SDK (Node.js) (planned)
- **Styling**: Nuxt UI (v3.3.0) with Tailwind CSS v4 (planned)
- **Authentication**: HttpOnly cookies with Appwrite (planned)
- **Development Environment**: macOS with Cursor IDE

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:3000
```

### Build Commands
```bash
npm run build          # Production build
npm run generate       # Static site generation
npm run preview        # Preview production build
npm run postinstall    # Prepare Nuxt (runs automatically after install)
```

## Architecture Patterns

### SSR-First Approach
- Use Server-Side Rendering (SSR) by default for SEO and performance
- Hydrate client-side state from server-rendered data
- Implement proper error boundaries and loading states

### Authentication Strategy
- Use HttpOnly cookies for session management (no tokens in client)
- Implement Appwrite Client SDK for browser operations
- Use Appwrite Node.js SDK for server-side API routes
- Populate Pinia stores early during SSR with user data

### State Management
- Use Pinia for client-side state management
- Implement Pinia Plugin Persistedstate for data persistence
- Use Pinia Colada for data fetching layer
- Follow the pattern: Server data → Pinia store → Components

### File Structure Conventions
- Use `app/` directory structure (Nuxt 4 pattern)
- Place components in logical groupings
- Use composables for reusable logic
- Implement server API routes in `server/api/`

## Code Style Guidelines

### TypeScript First
- Use TypeScript throughout the application
- Leverage Nuxt's auto-imports and type inference
- Define proper interfaces for data models
- Use `<script setup>` with TypeScript

### Component Patterns
- Use Composition API with `<script setup>`
- Implement proper props validation with TypeScript
- Use auto-imported composables and utilities
- Follow Vue 3 best practices for reactivity

### Error Handling
- Implement proper error boundaries
- Use Nuxt's error handling mechanisms
- Provide meaningful error messages
- Handle both server and client-side errors

## Development Guidelines

### Security Best Practices
- Never expose API keys or secrets in client code
- Use server-side validation for all user inputs
- Implement proper CORS and CSRF protection
- Follow Appwrite security rules and permissions

### Performance Considerations
- Leverage Nuxt's auto-imports for tree-shaking
- Use proper lazy loading for components and routes
- Implement efficient data fetching patterns
- Optimize images and assets

### Testing Strategy (when implemented)
- Unit tests for utilities and composables
- Component testing for Vue components
- E2E tests for critical user flows
- API endpoint testing for server routes

## Planned Features

This project is intended to implement:
- User authentication and registration
- Post creation and management
- Commenting system with nested replies
- Voting system (upvotes/downvotes)
- User profiles and karma system
- Real-time updates with Appwrite subscriptions
- Responsive design with Nuxt UI components

## Documentation References

- [Nuxt 4 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Appwrite Server SDK](https://appwrite.io/docs/quick-starts/node)
- [Pinia with Nuxt](https://pinia.vuejs.org/ssr/nuxt.html)
- [Nuxt UI Components](https://ui.nuxt.com/getting-started)

## Development Workflow

When implementing new features:
1. Start with server-side data modeling (Appwrite collections)
2. Create API routes using Appwrite Node.js SDK
3. Implement Pinia stores for state management
4. Build Vue components with TypeScript
5. Add proper error handling and loading states
6. Test functionality in development environment

This project follows German development practices and communication, emphasizing thorough documentation and step-by-step explanations for complex implementations.