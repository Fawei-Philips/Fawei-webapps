# AI Image Platform - Feature Documentation

## Overview
This is a comprehensive React-based web application that serves as the user interface for an AI image processing platform. The application provides a complete set of features for managing images, AI prompts, user authentication, and real-time updates.

## Key Features

### 1. User Authentication System
- **Login Page**: Secure authentication with username/password
- **JWT Token Management**: Automatic token storage and refresh
- **Protected Routes**: Unauthorized users are redirected to login
- **Session Management**: Persistent login state across page refreshes
- **Error Handling**: Clear error messages for failed login attempts

### 2. Image Gallery
- **Grid Layout**: Responsive image grid that adapts to screen size
- **Image Cards**: Each card displays thumbnail, title, prompt, and date
- **Pagination**: Navigate through large collections of images
- **Image Details Modal**: Click to view full image with complete metadata
- **Status Indicators**: Visual indicators for processing status
- **Metadata Display**: Shows prompt text, upload date, uploader, tags, and status

### 3. AI Image Upload
- **Drag & Drop**: Intuitive drag-and-drop interface for file upload
- **File Browser**: Traditional file picker as alternative
- **Image Preview**: Preview selected image before upload
- **Prompt Input**: Text area for AI prompt with character counter
- **File Validation**: 
  - Type validation (JPEG, PNG, GIF, WebP)
  - Size validation (10MB limit)
- **Upload Progress**: Visual progress bar during upload
- **Success/Error Feedback**: Clear messages for upload results

### 4. Upload History
- **History List**: View all past upload requests
- **Status Tracking**: 
  - Pending: Request submitted
  - Processing: AI is working on the image
  - Completed: Image successfully processed
  - Failed: Error occurred during processing
- **Prompt Display**: Shows the AI prompt used for each upload
- **Timestamp**: When the upload was submitted and completed
- **Result Preview**: Thumbnail of processed images
- **Error Messages**: Detailed error information for failed uploads
- **Pagination**: Navigate through upload history
- **Detail View**: Modal with complete information

### 5. RabbitMQ Real-Time Updates
- **WebSocket Connection**: STOMP protocol over SockJS
- **Connection Status**: Visual indicator in navigation bar
- **Auto-Reconnect**: Automatic reconnection on connection loss
- **Message Types**:
  - Image processed notifications
  - Upload progress updates
  - Status change notifications
- **Subscription Management**: Subscribe/unsubscribe to topics
- **Error Handling**: Graceful handling of connection errors

### 6. User Profile Management
- **View Profile**: Display user information
- **Edit Profile**: Update username and email
- **User Information**: Username, email, role, member since
- **Form Validation**: Client-side validation for updates
- **Success/Error Feedback**: Clear messages for updates

### 7. Navigation & Routing
- **Top Navigation Bar**: Always accessible navigation
- **Active Link Highlighting**: Visual indicator of current page
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Quick Links**:
  - Gallery: Browse images
  - Upload: Upload new images
  - History: View upload history
  - Profile: Manage user profile
  - Logout: Sign out of application
- **Connection Status**: RabbitMQ connection indicator in nav

## Technical Implementation

### Architecture
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Context API**: Global state management
- **Axios**: HTTP client with interceptors

### State Management
- **AuthContext**: User authentication state
- **RabbitMQContext**: WebSocket connection state
- **Local State**: Component-level state with hooks

### API Integration
- **RESTful API**: Integration with backend services
- **Token Refresh**: Automatic JWT token refresh
- **Error Interceptors**: Global error handling
- **Request Interceptors**: Auto-attach auth tokens

### Styling
- **Custom CSS**: Modular component styles
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Modern purple gradient theme
- **Loading States**: Spinners and skeleton screens
- **Error States**: User-friendly error messages

### Security
- **Protected Routes**: Authentication-required pages
- **Token Storage**: Secure local storage
- **HTTPS Ready**: Production-ready security
- **Input Validation**: Client-side validation

## Configuration

### Environment Variables
```
VITE_API_BASE_URL - Backend API endpoint
VITE_WS_BASE_URL - WebSocket endpoint
VITE_RABBITMQ_WS_URL - RabbitMQ WebSocket endpoint
```

### Application Constants
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF, WebP
- Page size: 20 items
- Maximum prompt length: 1000 characters

## User Experience

### Loading States
- Spinner animations during data fetching
- Progress bars for uploads
- Skeleton screens for content loading

### Error Handling
- Network error messages
- Validation error feedback
- Retry mechanisms
- Fallback content

### Accessibility
- Semantic HTML
- Keyboard navigation
- ARIA labels
- Screen reader support

## Future Enhancements
- Image search and filtering
- Batch upload
- Image editing features
- Social sharing
- Favorites/bookmarks
- Advanced analytics
- Export functionality
- Theme customization

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/      # Reusable UI components
├── contexts/        # React contexts for global state
├── pages/           # Page components
├── services/        # API and external services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and constants
```

## Support
This is a study project demonstrating modern React development practices with TypeScript, real-time communication, and comprehensive UI/UX design.
