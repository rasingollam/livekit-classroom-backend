# LiveKit Classroom Demo

This project is a simple, functional example of a virtual classroom application built with LiveKit, Node.js, and React. It demonstrates how to implement basic roles (teacher and student) with different permissions, such as the ability for a teacher to mute other participants.

## Features

-   Real-time video and audio communication.
-   Role-based permissions (Teacher vs. Student).
-   Teachers can mute and remove other participants.
-   Secure token generation on a Node.js backend.
-   Simple and clean user interface for joining rooms.
-   Built with the official LiveKit SDKs and pre-built React components.

## Technology Stack

-   **Backend**: Node.js, Express.js
-   **Frontend**: React.js
-   **Real-time Communication**: LiveKit
-   **Dependencies**: `livekit-server-sdk`, `livekit-client`, `@livekit/components-react`, `express`, `cors`, `dotenv`

## Project Structure

The project is divided into two main parts:

-   `livekit-classroom-backend/`: The Node.js server responsible for authenticating users and generating LiveKit access tokens.
-   `livekit-classroom-frontend/`: The React single-page application that users interact with to join video rooms.

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js and npm installed.
-   A LiveKit Cloud account and project credentials (API Key, API Secret, and URL).

### 1. Backend Setup

First, set up and run the backend server.

```bash
# Navigate to the backend directory
cd livekit-classroom-backend

# Install dependencies
npm install
```

Next, create an environment file to store your LiveKit credentials.

1.  Create a new file named `.env` in the `livekit-classroom-backend` root directory.
2.  Add your LiveKit credentials to the file:

    ```env
    # .env
    LIVEKIT_URL=wss://YOUR_PROJECT_URL.livekit.cloud
    LIVEKIT_API_KEY=YOUR_API_KEY
    LIVEKIT_API_SECRET=YOUR_API_SECRET

    # Optional: Port for your backend server
    PORT=3001
    ```

    **Important**: Replace the placeholder values with your actual credentials from the LiveKit Cloud dashboard.

Now, run the backend server:

```bash
node server.js
```

The server should now be running on `http://localhost:3001`. Keep this terminal window open.

### 2. Frontend Setup

In a **new terminal window**, set up and run the React frontend.

```bash
# Navigate to the frontend directory
cd livekit-classroom-frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

Your browser should automatically open to `http://localhost:3000`.

---

## How to Use

1.  **Start the Backend**: Make sure the Node.js server is running.
2.  **Start the Frontend**: Make sure the React development server is running.
3.  **Join as a Teacher**:
    -   Open a browser tab and navigate to `http://localhost:3000`.
    -   Enter your name.
    -   Enter a room name (e.g., `math-101`).
    -   Check the "I am a teacher" box.
    -   Click "Join Room".
4.  **Join as a Student**:
    -   Open a second browser tab or window.
    -   Enter a different name.
    -   Enter the **exact same room name** (`math-101`).
    -   Leave the "I am a teacher" box unchecked.
    -   Click "Join Room".

You should now be in a video call with