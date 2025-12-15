# Fawei-webapps

AI Image Platform - User Interface for Image AI Program

## Overview

This is a React-based web application that serves as the user interface for an AI image processing platform. The application provides comprehensive functionality for managing images, AI prompts, user authentication, and real-time updates through RabbitMQ.

## Features

### 1. Image Gallery
- Browse images with pagination
- View image details and metadata
- Display AI prompt text associated with each image
- Filter and search capabilities
- Responsive grid layout

### 2. AI Prompt & Image Upload
- Drag-and-drop image upload
- AI prompt text input
- File validation (type and size)
- Upload progress indication
- Support for JPEG, PNG, GIF, and WebP formats

### 3. User Authentication & Management
- Secure login system
- User profile management
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### 4. Upload History
- View all image upload requests
- Track processing status (pending, processing, completed, failed)
- Display prompt text and results
- Pagination support
- Detailed history view

### 5. RabbitMQ Real-time Updates
- WebSocket connection to RabbitMQ
- Real-time notifications for:
  - Image processing completion
  - Upload progress updates
  - Status changes
- Connection status indicator
- Automatic reconnection

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **STOMP.js** - WebSocket protocol for RabbitMQ
- **SockJS** - WebSocket polyfill

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API server (for full functionality)
- RabbitMQ server (for real-time updates)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Fawei-Philips/Fawei-webapps.git
cd Fawei-webapps
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` to configure your backend API and RabbitMQ endpoints:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/ws
VITE_RABBITMQ_WS_URL=ws://localhost:15674/ws
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components (Loading, Error, Navigation)
│   ├── gallery/         # Image gallery components
│   ├── history/         # Upload history components
│   └── upload/          # Image upload components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state management
│   └── RabbitMQContext.tsx  # RabbitMQ connection management
├── pages/               # Page components
│   ├── GalleryPage.tsx
│   ├── HistoryPage.tsx
│   ├── LoginPage.tsx
│   ├── UploadPage.tsx
│   └── UserProfile.tsx
├── services/            # API and external services
│   ├── api.ts           # Axios instance with interceptors
│   ├── authService.ts   # Authentication API calls
│   ├── historyService.ts # History API calls
│   ├── imageService.ts  # Image API calls
│   └── rabbitMQService.ts # RabbitMQ WebSocket client
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions and constants
│   └── config.ts        # Application configuration
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## API Integration

The application expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update` - Update user profile

### Images
- `GET /api/images` - List images with pagination
- `GET /api/images/:id` - Get image details
- `POST /api/images/upload` - Upload new image with prompt
- `DELETE /api/images/:id` - Delete image

### History
- `GET /api/history/uploads` - Get upload history
- `GET /api/history/:id` - Get history item details

## RabbitMQ Integration

The application connects to RabbitMQ via WebSocket using STOMP protocol:

- Connection endpoint: `ws://localhost:15674/ws`
- Supported message types:
  - `image_processed` - Image processing completion
  - `upload_progress` - Upload progress updates
  - `status_update` - General status changes

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |
| `VITE_WS_BASE_URL` | WebSocket base URL | `ws://localhost:8080/ws` |
| `VITE_RABBITMQ_WS_URL` | RabbitMQ WebSocket URL | `ws://localhost:15674/ws` |

### Application Constants

Configure in `src/utils/config.ts`:
- `MAX_FILE_SIZE` - Maximum upload file size (default: 10MB)
- `ALLOWED_FILE_TYPES` - Supported image formats
- `PAGE_SIZE` - Default pagination size (default: 20)
- `MAX_PROMPT_LENGTH` - Maximum prompt text length (default: 1000)

## Development

### Code Style

The project uses ESLint for code quality. Run linting:

```bash
npm run lint
```

### Type Checking

TypeScript is used throughout the project. Check types:

```bash
npm run build
```

## Demo Mode

The application includes a demo mode notice on the login page. When backend services are unavailable, users will see appropriate error messages with retry options.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is for study purposes.

## Contributing

This is a study project. Feel free to fork and modify as needed.
