# TikTok Clone Application

## Overview

This is a full-stack TikTok clone application built with modern web technologies. The application features a mobile-first vertical video feed interface with social media functionality including video uploads, likes, comments, follows, and user profiles. The frontend mimics TikTok's signature vertical scrolling video experience with overlay UI elements for interaction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Design System**: Dark theme with TikTok-inspired color scheme using CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Pattern**: RESTful endpoints following `/api/*` convention
- **Data Layer**: In-memory storage implementation with interface-based design for easy database migration
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

### Build System
- **Frontend Build**: Vite for fast development and optimized production builds
- **Backend Build**: ESBuild for efficient server-side bundling
- **Development**: Integrated development server with Vite middleware and hot module replacement

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Comprehensive social media schema including:
  - Users table with profile information and social metrics
  - Videos table with metadata, engagement stats, and media URLs
  - Comments table supporting nested replies
  - Follows table for user relationships
  - Video likes table for engagement tracking
- **Migrations**: Drizzle Kit for schema migrations and database management

### Mobile-First Design
- **Responsive Layout**: Tailwind CSS with mobile-first breakpoints
- **Touch Interactions**: Optimized for mobile gestures and touch navigation
- **Performance**: Lazy loading and optimized asset delivery for mobile networks

### Development Workflow
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Code Quality**: ESLint and TypeScript strict mode for code consistency
- **Hot Reload**: Development environment with fast refresh and error overlays

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database with `@neondatabase/serverless` driver
- **Connection**: Environment variable `DATABASE_URL` for database connectivity

### UI Components
- **Radix UI**: Comprehensive set of accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Modern icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

### Utilities
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Date Manipulation**: date-fns for date formatting and manipulation
- **Styling**: clsx and class-variance-authority for conditional CSS classes
- **Carousel**: Embla Carousel for swipeable content components

### Session Storage
- **PostgreSQL Sessions**: connect-pg-simple for persistent session management
- **Cookie Configuration**: Secure session handling with proper cookie settings