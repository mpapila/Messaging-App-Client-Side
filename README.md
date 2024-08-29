# Frontend Messaging App

This is the frontend for a real-time messaging app built using React, TypeScript, Redux Toolkit, and Socket.IO. The app allows users to send and receive messages, manage friend requests, and dynamically update the chat list and chat rooms.

## Live Site
[https://messaging-app-client-side.onrender.com](https://messaging-app-client-side.onrender.com/)

## Server Repository
[Messaging-App-Server-Side](https://github.com/mpapila/Messaging-App-Server-Side)

## Technologies Used

- **React
- **TypeScript
- **Redux Toolkit
- **Socket.IO
- **Material-UI
- **Vite

## Features

### 1. Authentication
- Users log in with a JWT token stored in localStorage.
- Authorization headers are attached to API requests for user authentication.

### 2. Chat Room
- Users can enter a chat room to send and receive messages in real-time.
- Messages are displayed with automatic scrolling to the latest message using the `AlwaysScrollToBottom` utility.
- Users' own messages appear on the right side, and other users' messages appear on the left.

### 3. Friend Requests
- Users can send friend requests via the `AddFriend` modal.
- A pending state is displayed for users who have not yet accepted the request.
- The admin user is auto-accepted as a friend.

### 4. Chat List
- Shows all friends and pending friend requests.
- Displays real-time updates when friends are added or pending requests are updated.
- Allows navigation between different chat rooms.

### 5. Real-Time Updates
- Real-time message delivery is powered by Socket.IO, ensuring live updates.
- Sockets are initialized with a JWT token to ensure secure communication.

### 6. Redux State Management
- **ChatListSlice**: Manages the state of the chat list and friend requests.
- **ChatRoomSlice**: Handles the state of chat rooms, including messages and selected chats.
- **LoadingSlice**: Controls the global loading state during API calls.
- **LogoutSlice**: Manages user logout and state reset.
- **DisplaySlice**: Manages UI visibility (e.g., showing/hiding chat components).
- **SocketSlice**: Manages Socket.IO connection and updates.

### 7. Loading Spinner
- Shows a full-screen loading spinner during API calls to indicate data is being processed.

### 8. Mobile Screen Support
- Responsive Design: The app is fully responsive and optimized for mobile screens. The layout adapts seamlessly, ensuring a smooth user experience on both desktop and mobile devices.
- Mobile Chat View: The chat interface is optimized for smaller screens, providing easy access to messages and navigation between chats.
- Friend Management on Mobile: The friend request modal and other UI elements are fully responsive, allowing for a smooth mobile interaction experience.

### Usage
- Add Friends: Navigate to the Add Friend modal and send a request to available users.
- Chat: Select a friend from the chat list and start chatting in real-time.
- Logout: Log out to clear all stored tokens and reset the app state.
